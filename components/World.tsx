'use client';
import {Canvas,useFrame,ThreeEvent} from '@react-three/fiber';
import {Html,RoundedBox,ContactShadows} from '@react-three/drei';
import {useMemo,useRef} from 'react';
import type {MutableRefObject} from 'react';
import {Clock,GuidedCharacters,getTourFocus} from './GuidedCharacters';
import type {TourStage} from '@/data/portfolio';
import * as THREE from 'three';
import {rooms,RoomId} from '@/data/portfolio';
const boxes=(at:[number,number,number],size:[number,number,number],color:string,key?:string)=> <RoundedBox key={key} position={at} args={size} radius={0.06} smoothness={2} castShadow receiveShadow><meshStandardMaterial color={color} roughness={0.8}/></RoundedBox>;
function Camera({time}:{time:MutableRefObject<number>}){
 const target=useMemo(()=>new THREE.Vector3(),[]);
 const look=useMemo(()=>new THREE.Vector3(),[]);
 const aim=useMemo(()=>new THREE.Vector3(),[]);
 useFrame(({camera},dt)=>{
   const focus=getTourFocus(time.current);
   target.set(focus[0]+7.8,9.3,focus[1]+11.7);
   aim.set(focus[0],.8,focus[1]);
   const smoothing=1-Math.exp(-Math.min(dt,.06)*1.9);
   camera.position.lerp(target,smoothing);
   look.lerp(aim,smoothing);
   camera.lookAt(look);
 });
 return null;
}
function Furnish({id}:{id:RoomId}){return <>{id==='welcome'? <>{boxes([-.3,.65,-.3],[2,.15,1],'#d2a27c')}{boxes([-.3,.3,-.5],[1.8,.6,.25],'#926a52')}{boxes([1.35,.6,1],[.8,1.2,.8],'#b8a48c')}</>:id==='works'? <>{[-1.2,1.1].map((x,i)=><group key={x}>{boxes([x,1.85,-1.94],[1.8,1.25,.12],'#5d726c')}{boxes([x,1.85,-1.85],[1.53,.94,.05],i?'#e2b993':'#a7d2bd')}</group>)}{boxes([0,.5,.85],[2.3,1,1],'#bc9173')}</>:id==='projects'?<>{[-1.25,1.2].map(x=><group key={x}>{boxes([x,.66,.2],[1.65,.2,1],'#af8b84')}{boxes([x,.35,.1],[1.4,.55,.25],'#836f79')}{boxes([x,1.15,-.05],[.85,.65,.08],'#576e76')}</group>)}</>:<>{boxes([1.1,1.2,-.9],[1.8,2.4,.8],'#64818b')}{[.52,1.17,1.82].map(i=>boxes([1.1,i,-.46],[1.55,.12,.15],'#d7b98c',String(i)))}{boxes([-1,.65,.2],[2,.2,1],'#c49e76')}{boxes([-1,1.18,0],[.85,.7,.08],'#3a5864')}</>}</>}

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
 return <Canvas shadows dpr={[1,1.5]} camera={{position:[13,15,19],fov:37}}
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
   {boxes([0,-.24,5.8],[1.5,.1,4.2],'#e0bc85')}
   {boxes([0,-.23,0],[14,.1,.8],'#e0bc85')}
   {boxes([0,-.23,4.65],[14,.1,.8],'#e0bc85')}
   {boxes([-1.05,.8,6.65],[.17,1.7,.18],'#e5c28a')}
   {boxes([1.05,.8,6.65],[.17,1.7,.18],'#e5c28a')}
   {boxes([0,1.67,6.65],[2.3,.18,.24],'#e5c28a')}
   {rooms.map(r=><Room key={r.id} id={r.id} onSelect={onSelect} onOpen={onOpen} selected={r.id===selected}/>)}
   <GuidedCharacters time={time}/>
   <ContactShadows position={[0,-.36,0]} opacity={.25} scale={30} blur={3}/>
   <Clock time={time} playing={playing} replay={replay} onStage={onStage} onProgress={onProgress}/>
   <Camera time={time}/>
 </Canvas>
}
