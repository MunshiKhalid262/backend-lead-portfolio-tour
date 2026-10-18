
'use client';
import {useEffect,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import type {MutableRefObject} from 'react';
import type {TourStage} from '@/data/portfolio';

type Point=[number,number];
type Node={point:Point;pause?:number;cue?:TourStage};
type Pose={point:Point;moving:boolean;stage:TourStage};
const speed=2.25;
const distance=(a:Point,b:Point)=>Math.hypot(b[0]-a[0],b[1]-a[1]);
const entrance:Point[]=[[0,7.2],[0,4.75],[0,-.22],[-3.3,-.22],[-3.3,-1.0]];
const route:Node[]=[
{point:[-3.3,-1.0],pause:3.8,cue:'welcome'},
{point:[-3.3,-.22]},
{point:[0,-.22]},
{point:[3.3,-.22]},
{point:[3.3,-.99],pause:8.5,cue:'works'},
{point:[3.3,-.22]},
{point:[0,-.22]},
{point:[0,4.65]},
{point:[-3.3,4.65]},
{point:[-3.3,3.58],pause:8.5,cue:'projects'},
{point:[-3.3,4.65]},
{point:[0,4.65]},
{point:[3.3,4.65]},
{point:[3.3,3.58],pause:8.5,cue:'skills'},
{point:[3.3,4.65]},
{point:[0,4.65]},
{point:[0,-.22]},
{point:[-3.3,-.22]},
{point:[-3.3,-1.0],pause:3.6,cue:'return'}
];
const entranceDuration=entrance.slice(1).reduce((s,p,i)=>s+distance(p,entrance[i])/speed,0);
const routeDuration=route.reduce((s,n,i)=>s+(i?distance(route[i-1].point,n.point)/speed:0)+(n.pause??0),0);
export const TOUR_DURATION=entranceDuration+routeDuration;

function linePath(points:Point[],seconds:number):Pose{
 let left=seconds;
 for(let i=1;i<points.length;i++){
   const from=points[i-1],to=points[i];
   const dt=distance(from,to)/speed;
   if(left<dt){const u=Math.max(0,Math.min(1,left/dt));return {point:[from[0]+(to[0]-from[0])*u,from[1]+(to[1]-from[1])*u],moving:true,stage:'arrival'};}
   left-=dt;
 }
 return {point:points[points.length-1],moving:false,stage:'arrival'};
}
function routePath(seconds:number):Pose{
 let left=Math.max(0,seconds),stage:TourStage='welcome';
 for(let i=0;i<route.length;i++){
   const node=route[i];
   if(i){
     const from=route[i-1].point,to=node.point,dt=distance(from,to)/speed;
     if(left<dt){const u=Math.min(1,left/dt);return {point:[from[0]+(to[0]-from[0])*u,from[1]+(to[1]-from[1])*u],moving:true,stage};}
     left-=dt;
   }
   if(node.cue)stage=node.cue;
   const pause=node.pause??0;
   if(left<pause)return {point:node.point,moving:false,stage};
   left-=pause;
 }
 return {point:route[route.length-1].point,moving:false,stage:'complete'};
}
export function currentTourStage(seconds:number):TourStage{
 if(seconds<entranceDuration)return 'arrival';
 return routePath(seconds-entranceDuration).stage;
}
export function getTourFocus(seconds:number):Point{
 if(seconds<entranceDuration)return linePath(entrance,seconds).point;
 return routePath(seconds-entranceDuration).point;
}
function personAt(seconds:number,role:'visitor'|'guide'):Pose{
 if(role==='guide') {
   if(seconds<=entranceDuration)return {point:route[0].point,moving:false,stage:'arrival'};
   return routePath(seconds-entranceDuration);
 }
 if(seconds<entranceDuration)return linePath(entrance,seconds);
 const pose=routePath(Math.max(0,seconds-entranceDuration-.8));
 return {...pose,point:[pose.point[0]+.38,pose.point[1]+.4]};
}

export function Clock({
 time,playing,replay,onStage,onProgress
}:{
 time:MutableRefObject<number>;
 playing:boolean;
 replay:number;
 onStage:(stage:TourStage)=>void;
 onProgress:(value:number)=>void;
}){
 const previous=useRef<TourStage|null>(null);
 const lastSecond=useRef(-1);
 useEffect(()=>{time.current=0;previous.current=null;lastSecond.current=-1;onStage('arrival');onProgress(0);},[replay,time,onStage,onProgress]);
 useFrame((_,delta)=>{
   if(playing)time.current=Math.min(TOUR_DURATION,time.current+Math.min(delta,.08));
   const stage=currentTourStage(time.current);
   if(stage!==previous.current){previous.current=stage;onStage(stage);}
   const whole=Math.floor(time.current);
   if(whole!==lastSecond.current){lastSecond.current=whole;onProgress(Math.min(100,Math.round(time.current/TOUR_DURATION*100)));}
 });
 return null;
}
function Character({role,time}:{
 role:'guide'|'visitor';
 time:MutableRefObject<number>;
}){
 const root=useRef<THREE.Group>(null);
 const leftLeg=useRef<THREE.Group>(null);
 const rightLeg=useRef<THREE.Group>(null);
 const leftArm=useRef<THREE.Group>(null);
 const rightArm=useRef<THREE.Group>(null);
 const torso=useRef<THREE.Group>(null);
 const skin=role==='guide'?'#c68c69':'#dca481';
 const outfit=role==='guide'?'#548977':'#cf8751';
 useFrame((_,delta)=>{
   const t=time.current,pose=personAt(t,role),forward=personAt(Math.min(t+.07,TOUR_DURATION),role);
   if(!root.current)return;
   root.current.position.set(pose.point[0],.08,pose.point[1]);
   const dx=forward.point[0]-pose.point[0], dz=forward.point[1]-pose.point[1];
   if(Math.hypot(dx,dz)>.006){
     const heading=Math.atan2(dx,dz);
     let diff=heading-root.current.rotation.y;
     diff=Math.atan2(Math.sin(diff),Math.cos(diff));
     root.current.rotation.y+=diff*Math.min(1,delta*8);
   }
   const step=pose.moving?Math.sin(t*10)*.56:0;
   if(leftLeg.current)leftLeg.current.rotation.x=step;
   if(rightLeg.current)rightLeg.current.rotation.x=-step;
   if(leftArm.current)leftArm.current.rotation.x=-step*.75;
   if(rightArm.current)rightArm.current.rotation.x=step*.75;
   if(torso.current)torso.current.position.y=pose.moving?Math.abs(Math.sin(t*10))*.045:Math.sin(t*1.7)*.012;
 });
 return <group ref={root} scale={.68}>
   <group ref={torso}>
     <mesh position={[0,1.26,0]} castShadow><capsuleGeometry args={[.28,.44,6,12]}/><meshStandardMaterial color={outfit} roughness={.85}/></mesh>
     <mesh position={[0,1.83,.005]} castShadow><sphereGeometry args={[.28,20,16]}/><meshStandardMaterial color={skin} roughness={.9}/></mesh>
     <mesh position={[0,2.01,-.07]} scale={[1.04,.45,.92]} castShadow><sphereGeometry args={[.28,16,12]}/><meshStandardMaterial color={role==='guide'?'#332f30':'#604436'}/></mesh>
     {role==='guide'&&<mesh position={[0,1.94,-.28]} castShadow><sphereGeometry args={[.18,12,10]}/><meshStandardMaterial color='#332f30'/></mesh>}
     {[-.11,.11].map(x=><group key={x}>
       <mesh position={[x,1.84,.255]}><sphereGeometry args={[.025,8,8]}/><meshStandardMaterial color='#2e3638'/></mesh>
       <mesh position={[x,1.85,.272]}><sphereGeometry args={[.009,8,8]}/><meshBasicMaterial color='white'/></mesh>
     </group>)}
     <mesh position={[0,1.73,.271]} rotation={[0,0,Math.PI/2]}><capsuleGeometry args={[.009,.085,3,8]}/><meshStandardMaterial color='#9b554c'/></mesh>
     <mesh position={[0,1.65,0]}><cylinderGeometry args={[.09,.095,.18,10]}/><meshStandardMaterial color={skin}/></mesh>
     {role==='visitor'&&<>
       <mesh position={[0,1.18,-.31]}><boxGeometry args={[.47,.62,.17]}/><meshStandardMaterial color='#4a7066'/></mesh>
       <mesh position={[0,1.46,.293]}><boxGeometry args={[.29,.04,.06]}/><meshStandardMaterial color='#ead9bb'/></mesh>
     </>}
     {role==='guide'&&<mesh position={[0,1.22,.303]}><boxGeometry args={[.17,.23,.03]}/><meshStandardMaterial color='#eee4c8'/></mesh>}
   </group>
   {[-1,1].map((side)=>(
     <group key={side} ref={side===-1?leftArm:rightArm} position={[side*.32,1.46,0]}>
       <mesh position={[side*.025,-.27,0]} rotation={[0,0,side*.13]} castShadow><capsuleGeometry args={[.088,.38,5,10]}/><meshStandardMaterial color={outfit}/></mesh>
       <mesh position={[side*.05,-.58,0]} castShadow><sphereGeometry args={[.096,10,8]}/><meshStandardMaterial color={skin}/></mesh>
     </group>
   ))}
   {[-1,1].map(side=>(
     <group key={side} ref={side===-1?leftLeg:rightLeg} position={[side*.15,.8,0]}>
       <mesh position={[0,-.29,0]} castShadow><capsuleGeometry args={[.115,.48,5,10]}/><meshStandardMaterial color={role==='guide'?'#344b53':'#476584'}/></mesh>
       <mesh position={[0,-.67,.09]} castShadow><boxGeometry args={[.24,.14,.38]}/><meshStandardMaterial color='#433b37'/></mesh>
     </group>
   ))}
 </group>;
}
export function GuidedCharacters({time}:{time:MutableRefObject<number>}){
 return <><Character role='visitor' time={time}/><Character role='guide' time={time}/></>;
}
