'use client';
import {Canvas,useFrame,ThreeEvent} from '@react-three/fiber';
import {Html,RoundedBox,ContactShadows} from '@react-three/drei';
import {useMemo,useRef} from 'react';
import type {MutableRefObject} from 'react';
import {Clock,GuidedCharacters} from './GuidedCharacters';
import {getTourFocus,getDoorOpen} from './tourTimeline';
import type {TourStage} from '@/data/portfolio';
import * as THREE from 'three';
import {rooms,RoomId} from '@/data/portfolio';
const boxes=(at:[number,number,number],size:[number,number,number],color:string,key?:string)=> <RoundedBox key={key} position={at} args={size} radius={0.06} smoothness={2} castShadow receiveShadow><meshStandardMaterial color={color} roughness={0.8}/></RoundedBox>;
function Camera({time}:{time:MutableRefObject<number>}){
 const target=useMemo(()=>new THREE.Vector3(),[]);
 const look=useMemo(()=>new THREE.Vector3(),[]);
 const aim=useMemo(()=>new THREE.Vector3(),[]);
 useFrame(({camera},dt)=>{
   const t=time.current,point=getTourFocus(t);
   // Elevated orbit: establish whole-floor geography, then gently rotate
   // around guided activity without obstructing the rooms.
   const orbit=Math.sin(t*.045)*.28;
   const perspective=camera as THREE.PerspectiveCamera;
   const fov=perspective.aspect<1?52:40;
   if(perspective.fov!==fov){perspective.fov=fov;perspective.updateProjectionMatrix();}
   const radius=perspective.aspect<1?28:17;
   const top=22;
   const centerBlend=.22;
   const fx=point[0]*centerBlend,fz=point[1]*centerBlend;
   target.set(fx+Math.cos(orbit+.85)*radius,top,fz+Math.sin(orbit+.85)*radius);
   aim.set(fx,.45,fz);
   const factor=1-Math.exp(-Math.min(dt,.06)*1.3);
   camera.position.lerp(target,factor);
   look.lerp(aim,factor);
   camera.lookAt(look);
 });
 return null;
}
function GlassEntrance({time}:{time:MutableRefObject<number>}){
 const door=useRef<THREE.Group>(null);
 useFrame((_,dt)=>{
   if(door.current)door.current.rotation.y=THREE.MathUtils.damp(door.current.rotation.y,-getDoorOpen(time.current)*1.12,4,Math.min(dt,.06));
 });
 return <group position={[0,0,6.85]}>
   {boxes([-1.24,1.28,0],[.14,2.65,.18],'#697d79')}
   {boxes([1.24,1.28,0],[.14,2.65,.18],'#697d79')}
   {boxes([0,2.61,0],[2.58,.12,.2],'#697d79')}
   <group ref={door} position={[-1.15,0,0]}>
     <group position={[1.15,0,0]}>
       <mesh position={[0,1.32,0]}><boxGeometry args={[2.26,2.48,.055]}/><meshStandardMaterial color='#a6d2d2' transparent opacity={.22} roughness={.14} metalness={.15} depthWrite={false}/></mesh>
       {boxes([0,2.5,0],[2.36,.09,.11],'#607a7b')}
       {boxes([0,.12,0],[2.36,.09,.11],'#607a7b')}
       {boxes([-1.12,1.3,0],[.09,2.49,.1],'#607a7b')}
       {boxes([1.12,1.3,0],[.09,2.49,.1],'#607a7b')}
       {boxes([.77,1.27,.12],[.07,.5,.09],'#d9b77f')}
     </group>
   </group>
 </group>;
}
function ReceptionProps(){
 return <group position={[-3.3,0,-2.4]}>
   {boxes([-.3,.73,-.24],[2.05,.15,1.13],'#ba926e')}
   {boxes([-.3,.37,-.6],[1.9,.67,.25],'#8f6c56')}
   {boxes([-.3,.99,-.48],[.78,.58,.08],'#4c5964')}
   {boxes([-.3,.82,-.21],[.78,.07,.45],'#707b81')}
   {boxes([-.3,.84,-.2],[.65,.035,.3],'#a1b8b7')}
   {boxes([-.3,.44,-1.05],[.54,.12,.58],'#5c756b')}
   {boxes([-.3,.78,-1.32],[.5,.8,.16],'#617b71')}
   {boxes([.72,.25,.55],[.75,.5,.65],'#a77e5d')}
 </group>;
}
function Furnish({id}:{id:RoomId}){return <>{id==='welcome'? <>{boxes([1.35,.6,1],[.8,1.2,.8],'#b8a48c')}</>:id==='works'? <>{[-1.2,1.1].map((x,i)=><group key={x}>{boxes([x,1.85,-1.94],[1.8,1.25,.12],'#5d726c')}{boxes([x,1.85,-1.85],[1.53,.94,.05],i?'#e2b993':'#a7d2bd')}</group>)}</>:id==='projects'?<>{[-1.25,1.2].map(x=><group key={x}>{boxes([x,.66,.2],[1.65,.2,1],'#af8b84')}{boxes([x,.35,.1],[1.4,.55,.25],'#836f79')}{boxes([x,1.15,-.05],[.85,.65,.08],'#576e76')}</group>)}</>:<>{boxes([1.1,1.2,-.9],[1.8,2.4,.8],'#64818b')}{[.52,1.17,1.82].map(i=>boxes([1.1,i,-.46],[1.55,.12,.15],'#d7b98c',String(i)))}{boxes([-1,.65,.2],[2,.2,1],'#c49e76')}{boxes([-1,1.18,0],[.85,.7,.08],'#3a5864')}</>}</>}

function ArchitecturalDetail({id}:{id:RoomId}) {
return <>
{boxes([0,2.9,-2.03],[5.65,.13,.2],'#f9eedb')}
{boxes([-2.72,2.8,0],[.19,.14,4.06],'#faf0df')}
{boxes([0,.22,-1.94],[5.5,.16,.16],'#bda083')}
{[-1.4,1.4].map(x=><group key={x} position={[x,2.86,-.3]}>
<mesh><cylinderGeometry args={[.26,.3,.1,16]}/><meshStandardMaterial color='#b79d73' metalness={.3}/></mesh>
<mesh position={[0,-.19,0]}><cylinderGeometry args={[.36,.22,.28,16]}/><meshStandardMaterial color='#fff1d6' emissive='#e9c890' emissiveIntensity={.5}/></mesh>
</group>)}
{id==='welcome'&&<>
{boxes([-1.9,.3,1.15],[.55,.45,.45],'#bd8264')}
<mesh position={[-1.9,.76,1.15]} castShadow><sphereGeometry args={[.34,12,12]}/><meshStandardMaterial color='#628861'/></mesh>
{boxes([1.18,.42,1.1],[1.2,.72,.7],'#c3a17e')}
</>}
{id==='works'&&[-1.28,1.3].map((x,i)=><group key={x}>
{boxes([x,.52,.9],[1.25,.9,.84],i?'#bb987a':'#c2a68b')}
{boxes([x,1.02,.9],[1.35,.11,.92],'#f0e2ce')}
{boxes([x,1.13,.9],[.8,.12,.6],i?'#dfbd8b':'#9cbfae')}
</group>)}
{id==='projects'&&[-1.05,1.12].map(x=><group key={x}>
{boxes([x,1.18,.14],[.84,.54,.1],'#435d67')}
{boxes([x,1.18,.2],[.7,.42,.02],'#a7c5bc')}
{boxes([x,.82,.16],[.09,.18,.12],'#596b6c')}
</group>)}
{id==='skills'&&[-.1,1.08].map(x=><group key={x}>
{boxes([x,1.33,-1.2],[.98,2.35,.68],'#4e6871')}
{[0,1,2,3,4,5].map(i=><group key={i}>
{boxes([x,.42+i*.35,-.84],[.75,.2,.07],'#30454a')}
<mesh position={[x+.23,.42+i*.35,-.795]}><sphereGeometry args={[.027,8,8]}/><meshStandardMaterial color='#b0ddb1' emissive='#83c99a' emissiveIntensity={1}/></mesh>
</group>)}
</group>)}
</>
}

function Room({id,onSelect,onOpen,selected}:{id:RoomId;onSelect:(id:RoomId)=>void;onOpen:(id:RoomId)=>void;selected:boolean}){const r=rooms.find(x=>x.id===id)!;const [x,,z]=r.position;const click=(e:ThreeEvent<MouseEvent>)=>{e.stopPropagation();onSelect(id)};return <group position={[x,0,z]} onClick={click}>{boxes([0,-.14,0],[5.7,.3,4.2],selected?'#f3d69a':'#dbc3a3')}{boxes([0,1.33,-2.06],[5.7,2.85,.17],r.color)}{boxes([-2.8,1.33,0],[.16,2.85,4.15],r.color)}{boxes([0,.035,0],[5.35,.08,3.86],'#e6ccb0')}<Furnish id={id}/><ArchitecturalDetail id={id}/><Html transform center position={[0,3.25,-1.78]} distanceFactor={9} style={{pointerEvents:'none'}}><div style={{whiteSpace:'nowrap',background:'#fffdf5',color:'#3a4d40',fontSize:11,fontWeight:800,letterSpacing:'0.08em',padding:'8px 14px',borderRadius:10,boxShadow:'0 5px 12px #0002'}}>{r.title.toUpperCase()}</div></Html>{selected&&<Html center position={[0,3.13,.1]} distanceFactor={8.7} zIndexRange={[25,0]}><button className='world-hotspot' type='button' aria-label={`Open ${r.title} details`} onClick={e=>{e.stopPropagation();onOpen(id)}}>✦ Explore exhibit ↗</button></Html>}<mesh position={[0,.055,0]} onClick={click}><boxGeometry args={[5.3,.06,3.8]}/><meshBasicMaterial transparent opacity={0}/></mesh></group>}

export default function World({
 selected,onSelect,onOpen,playing,replay,onStage,onProgress
}:{
 selected:RoomId|null;
 onSelect:(id:RoomId)=>void;
 onOpen:(id:RoomId)=>void;
 playing:boolean;
 replay:number;
 onStage:(stage:TourStage)=>void;
 onProgress:(value:number)=>void;
}){
 const time=useRef(0);
 return <Canvas key={replay} shadows dpr={[1,1.5]} camera={{position:[17,18,19],fov:40}}
   gl={{antialias:true}} fallback={<div className="world-fallback">3D is unavailable on this device. Switch to the text experience to explore.</div>}>
   <color attach="background" args={['#f6ede0']}/>
   <ambientLight intensity={1.15}/>
   <hemisphereLight args={['#ffffff','#b99c7a',1.8]}/>
   <directionalLight position={[7,13,8]} intensity={2.8} castShadow shadow-mapSize={[1024,1024]}
     shadow-camera-left={-15} shadow-camera-right={15} shadow-camera-top={15} shadow-camera-bottom={-15}/>
   <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.4,0]} receiveShadow>
     <planeGeometry args={[100,100]}/><meshStandardMaterial color="#f6ede0"/>
   </mesh>
   {boxes([0,-.23,0],[1,.1,10],'#e0bc85')}
   {boxes([0,-.24,5.8],[2.9,.1,6.1],'#d6b48a')}
   {boxes([0,-.23,0],[14,.1,.8],'#e0bc85')}
   {boxes([0,-.23,4.65],[14,.1,.8],'#e0bc85')}
   <GlassEntrance time={time}/><ReceptionProps/>
   {rooms.map(r=><Room key={r.id} id={r.id} onSelect={onSelect} onOpen={onOpen} selected={r.id===selected}/>)}
   <GuidedCharacters time={time}/>
   <ContactShadows frames={1} position={[0,-.36,0]} opacity={.25} scale={30} blur={3}/>
   <Clock time={time} playing={playing} replay={replay} onStage={onStage} onProgress={onProgress}/>
   <Camera time={time}/>
 </Canvas>
}
