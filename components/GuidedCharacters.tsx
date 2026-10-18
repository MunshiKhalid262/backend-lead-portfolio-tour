
'use client';
import {useEffect,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import type {MutableRefObject} from 'react';
import type {TourStage} from '@/data/portfolio';

import type {Pose} from './tourTimeline';
import {ENTRANCE_DURATION,TOUR_DURATION,currentTourStage,personAt} from './tourTimeline';

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
   if(time.current>=TOUR_DURATION)onProgress(100);
   if(stage!==previous.current){previous.current=stage;onStage(stage);}
   const whole=Math.floor(time.current);
   if(whole!==lastSecond.current){lastSecond.current=whole;onProgress(Math.min(100,Math.round(time.current/TOUR_DURATION*100)));}
 });
 return null;
}
export type ActorState='idle'|'walk'|'wave'|'point'|'talk'|'listen'|'lookAround'|'beckon'|'farewell';
function actorState(seconds:number,role:'guide'|'visitor',pose:Pose):ActorState{
 if(pose.moving)return 'walk';
 if(role==='guide'&&seconds<ENTRANCE_DURATION+3)return seconds<ENTRANCE_DURATION?'idle':seconds<ENTRANCE_DURATION+1.1?'wave':'beckon';
 if(pose.stage==='arrival')return 'idle';
 if(seconds>TOUR_DURATION-5||pose.stage==='complete'||pose.stage==='return')return role==='guide'?'farewell':'wave';
 const elapsed=Math.max(0,seconds-ENTRANCE_DURATION);
 // Distinct gestures at every stop. Actions are synchronized from the shared tour clock.
 if(pose.stage==='welcome')return role==='guide'?(elapsed<2.2?'wave':elapsed<3.2?'beckon':'talk'):'listen';
 if(pose.stage==='works')return role==='guide'?(seconds%8<4?'point':'talk'):'lookAround';
 if(pose.stage==='projects')return role==='guide'?(seconds%8<4?'talk':'point'):'listen';
 if(pose.stage==='skills')return role==='guide'?(seconds%8<4?'point':'talk'):'lookAround';
 return 'idle';
}
const smooth=(current:number,target:number,delta:number,speed=7)=>THREE.MathUtils.damp(current,target,speed,Math.min(delta,.08));

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
 const head=useRef<THREE.Group>(null);
 const rightHand=useRef<THREE.Group>(null);
 const leftKnee=useRef<THREE.Group>(null);
 const rightKnee=useRef<THREE.Group>(null);
 const skin=role==='guide'?'#c68c69':'#dca481';
 const outfit=role==='guide'?'#548977':'#cf8751';
 useFrame((_,delta)=>{
   const t=time.current,pose=personAt(t,role),forward=personAt(Math.min(t+.07,TOUR_DURATION),role);
   if(!root.current)return;
   const seated=role==='guide' && t<ENTRANCE_DURATION+1.6;
   const standProgress=role==='guide'?Math.max(0,Math.min(1,(t-ENTRANCE_DURATION-1.6)/1.6)):1;
   root.current.position.set(pose.point[0],.08-(1-standProgress)*.12,pose.point[1]);
   root.current.rotation.z=role==='guide'?(.18*(1-standProgress)):0;
   const dx=forward.point[0]-pose.point[0], dz=forward.point[1]-pose.point[1];
   if(Math.hypot(dx,dz)>.006){
     const heading=Math.atan2(dx,dz);
     let diff=heading-root.current.rotation.y;
     diff=Math.atan2(Math.sin(diff),Math.cos(diff));
     root.current.rotation.y+=diff*Math.min(1,delta*8);
   }
   if(!pose.moving){
     const other=personAt(t,role==='guide'?'visitor':'guide').point;
     const heading=seated?0:Math.atan2(other[0]-pose.point[0],other[1]-pose.point[1]);
     const diff=Math.atan2(Math.sin(heading-root.current.rotation.y),Math.cos(heading-root.current.rotation.y));
     root.current.rotation.y+=diff*Math.min(1,delta*6);
   }
   const action=actorState(t,role,pose);
   const w=Math.sin(t*9.8), wave=Math.sin(t*11), breath=Math.sin(t*1.65);
   const walking=action==='walk';
   const swing=walking?w*.62:0;
   const gestures=action==='wave'||action==='farewell';
   const pointing=action==='point';
   const beckoning=action==='beckon';
   const talking=action==='talk';
   const listening=action==='listen';
   const looking=action==='lookAround';
   const sit=1-standProgress;
   const leftLegX=-sit*1.4+swing*(1-sit), rightLegX=-sit*1.4-swing*(1-sit);
   if(leftKnee.current)leftKnee.current.rotation.x=sit*1.4+(walking?Math.max(0,-w)*.8:0);
   if(rightKnee.current)rightKnee.current.rotation.x=sit*1.4+(walking?Math.max(0,w)*.8:0);
   const leftArmX=seated?-1.25:walking?-swing*.7:talking?Math.sin(t*3.6)*.24:0;
   const rightArmX=seated?-1.25:walking?swing*.7:gestures?.65+wave*.25:pointing?.25:beckoning?.4+Math.sin(t*4)*.28:talking?Math.sin(t*4)*.37:0;
   const leftArmZ=talking?-.18:0;
   const rightArmZ=gestures?-1.7:pointing?-1.32:beckoning?-1.22:talking?-.45:0;
   const headY=looking?Math.sin(t*1.25)*.49:pointing?.33:listening?-.2:0;
   const headZ=listening?Math.sin(t*2.6)*.08:gestures?-.12:0;
   const tilt=pointing?.15:talking?Math.sin(t*2.4)*.09:0;
   if(leftLeg.current)leftLeg.current.rotation.x=smooth(leftLeg.current.rotation.x,leftLegX,delta);
   if(rightLeg.current)rightLeg.current.rotation.x=smooth(rightLeg.current.rotation.x,rightLegX,delta);
   if(leftArm.current){
     leftArm.current.rotation.x=smooth(leftArm.current.rotation.x,leftArmX,delta);
     leftArm.current.rotation.z=smooth(leftArm.current.rotation.z,leftArmZ,delta);
   }
   if(rightArm.current){
     rightArm.current.rotation.x=smooth(rightArm.current.rotation.x,rightArmX,delta);
     rightArm.current.rotation.z=smooth(rightArm.current.rotation.z,rightArmZ,delta);
   }
   if(head.current){
     head.current.rotation.y=smooth(head.current.rotation.y,headY,delta,4);
     head.current.rotation.z=smooth(head.current.rotation.z,headZ,delta);
   }
   if(rightHand.current)rightHand.current.rotation.x=smooth(rightHand.current.rotation.x,gestures?wave*.35:beckoning?Math.sin(t*5)*.4:0,delta);
   if(torso.current){
     torso.current.rotation.y=smooth(torso.current.rotation.y,tilt,delta);
     torso.current.position.y=walking?Math.abs(w)*.045:breath*.014;
   }
 });
 return <group ref={root} scale={.68}>
   <group ref={torso}>
     <mesh position={[0,1.26,0]} castShadow><capsuleGeometry args={[.28,.44,6,12]}/><meshStandardMaterial color={outfit} roughness={.85}/></mesh>
     <group ref={head} position={[0,1.75,0]}>
     <mesh position={[0,.08,.005]} castShadow><sphereGeometry args={[.28,20,16]}/><meshStandardMaterial color={skin} roughness={.9}/></mesh>
     <mesh position={[0,.26,-.07]} scale={[1.04,.45,.92]} castShadow><sphereGeometry args={[.28,16,12]}/><meshStandardMaterial color={role==='guide'?'#332f30':'#604436'}/></mesh>
     {role==='guide'&&<mesh position={[0,.19,-.28]} castShadow><sphereGeometry args={[.18,12,10]}/><meshStandardMaterial color='#332f30'/></mesh>}
     {[-.11,.11].map(x=><group key={x}>
       <mesh position={[x,.09,.255]}><sphereGeometry args={[.025,8,8]}/><meshStandardMaterial color='#2e3638'/></mesh>
       <mesh position={[x,.1,.272]}><sphereGeometry args={[.009,8,8]}/><meshBasicMaterial color='white'/></mesh>
     </group>)}
     <mesh position={[0,-.02,.271]} rotation={[0,0,Math.PI/2]}><capsuleGeometry args={[.009,.085,3,8]}/><meshStandardMaterial color='#9b554c'/></mesh>
     </group>
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
       <group ref={side===1?rightHand:undefined} position={[side*.05,-.58,0]}><mesh castShadow><sphereGeometry args={[.096,10,8]}/><meshStandardMaterial color={skin}/></mesh></group>
     </group>
   ))}
   {[-1,1].map(side=>(
     <group key={side} ref={side===-1?leftLeg:rightLeg} position={[side*.15,.8,0]}>
       <mesh position={[0,-.17,0]} castShadow><capsuleGeometry args={[.115,.2,5,10]}/><meshStandardMaterial color={role==='guide'?'#344b53':'#476584'}/></mesh>
       <group ref={side===-1?leftKnee:rightKnee} position={[0,-.36,0]}>
       <mesh position={[0,-.15,0]} castShadow><capsuleGeometry args={[.1,.18,5,10]}/><meshStandardMaterial color={role==='guide'?'#344b53':'#476584'}/></mesh>
       <mesh position={[0,-.31,.09]} castShadow><boxGeometry args={[.24,.14,.38]}/><meshStandardMaterial color='#433b37'/></mesh></group>
     </group>
   ))}
 </group>;
}
export function GuidedCharacters({time}:{time:MutableRefObject<number>}){
 return <><Character role='visitor' time={time}/><Character role='guide' time={time}/></>;
}
