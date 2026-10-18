'use client';
import {Canvas,useFrame} from '@react-three/fiber';
import {useMemo,useRef} from 'react';
import type {MutableRefObject} from 'react';
import {Clock,GuidedCharacters} from './GuidedCharacters';
import {getDoorOpen} from './tourTimeline';
import {cameraShot} from './cameraRig';
import {OfficeEnvironment,Block} from './OfficeEnvironment';
import type {TourStage,RoomId} from '@/data/portfolio';
import * as THREE from 'three';

function Camera({time}:{time:MutableRefObject<number>}){
 const target=useMemo(()=>new THREE.Vector3(),[]);
 const look=useMemo(()=>new THREE.Vector3(),[]);
 const aim=useMemo(()=>new THREE.Vector3(),[]);
 const previous=useRef({time:-1,aspect:0,compact:false});
 useFrame(({camera,size},dt)=>{
   const perspective=camera as THREE.PerspectiveCamera;
   const t=time.current,aspect=perspective.aspect,compact=size.width<600;
   if(previous.current.time===t&&previous.current.aspect===aspect&&previous.current.compact===compact)return;
   const shot=cameraShot(t,aspect,compact);
   if(perspective.fov!==shot.fov){perspective.fov=shot.fov;perspective.updateProjectionMatrix();}
   const [x,z]=shot.center;
   target.set(x+Math.cos(shot.orbit)*shot.radius,shot.height,z+Math.sin(shot.orbit)*shot.radius);
   aim.set(x,.6,z);
   const reset=previous.current.time<0||t<previous.current.time;
   const factor=reset?1:1-Math.exp(-Math.min(dt,.06)*2.4);
   camera.position.lerp(target,factor);look.lerp(aim,factor);camera.lookAt(look);
   previous.current={time:t,aspect,compact};
 });
 return null;
}
function GlassEntrance({time}:{time:MutableRefObject<number>}){
 const door=useRef<THREE.Group>(null);
 useFrame(()=>{if(door.current)door.current.rotation.y=-getDoorOpen(time.current)*1.35;});
 return <group position={[0,0,6.85]}>
   {[-1.24,1.24].map(x=><Block key={x} at={[x,1.28,0]} size={[.085,2.65,.12]} color='#404e53'/>)}
   <Block at={[0,2.61,0]} size={[2.58,.09,.13]} color='#404e53'/>
   <group ref={door} position={[-1.15,0,0]}><group position={[1.15,0,0]}>
     <mesh position={[0,1.32,0]}><boxGeometry args={[2.26,2.48,.035]}/><meshStandardMaterial color='#bad9dd' transparent opacity={.16} roughness={.12} metalness={.15} depthWrite={false}/></mesh>
     {[.12,2.5].map(y=><Block key={y} at={[0,y,0]} size={[2.36,.055,.07]} color='#4a585e'/>)}
     {[-1.12,1.12].map(x=><Block key={x} at={[x,1.3,0]} size={[.055,2.49,.07]} color='#4a585e'/>)}
     <Block at={[.77,1.27,.12]} size={[.05,.46,.06]} color='#c7b58f'/>
   </group></group>
   <Block at={[0,.045,.65]} size={[2.3,.045,.9]} color='#687777'/>
 </group>;
}
export default function World({selected,onOpen,playing,replay,onStage,onProgress}:{
 selected:RoomId|null;
 onSelect:(id:RoomId)=>void;
 onOpen:(id:RoomId)=>void;
 playing:boolean;
 replay:number;
 onStage:(stage:TourStage)=>void;
 onProgress:(value:number)=>void;
}){
 const time=useRef(0);
 return <Canvas key={replay} shadows dpr={[1,1.5]} camera={{position:[12,20,16],fov:39,near:.1,far:100}}
 gl={{antialias:true,powerPreference:'high-performance'}} fallback={<div className='world-fallback'>3D is unavailable. Read the complete portfolio instead.</div>}>
 <color attach='background' args={['#e7e9e6']}/>
 <ambientLight intensity={.65}/>
 <hemisphereLight args={['#fafbff','#85908a',1.35]}/>
 <directionalLight position={[-8,16,8]} intensity={2.3} castShadow shadow-mapSize={[1024,1024]} shadow-bias={-.0003}
 shadow-normalBias={.035} shadow-camera-left={-11} shadow-camera-right={11} shadow-camera-top={13} shadow-camera-bottom={-10}/>
 <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.45,0]} receiveShadow><planeGeometry args={[120,120]}/><meshStandardMaterial color='#d9ddd9' roughness={.95}/></mesh>
 <OfficeEnvironment selected={selected} onOpen={onOpen}/>
 <GlassEntrance time={time}/><GuidedCharacters time={time}/>
 <Clock time={time} playing={playing} replay={replay} onStage={onStage} onProgress={onProgress}/>
 <Camera time={time}/>
 </Canvas>;
}
