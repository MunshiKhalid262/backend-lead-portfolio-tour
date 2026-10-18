'use client';
import {Html,RoundedBox} from '@react-three/drei';
import {rooms,type RoomId} from '@/data/portfolio';

type Vec=[number,number,number];
const palette={oak:'#bd9770',ivory:'#f0ede5',frame:'#424d50',floor:'#b9bdbb',green:'#50755a'};
export function Block({at,size,color=palette.ivory}:{at:Vec;size:Vec;color?:string}){
 return <mesh position={at} castShadow receiveShadow><boxGeometry args={size}/><meshStandardMaterial color={color} roughness={.76}/></mesh>;
}
function Glass({at,size}:{at:Vec;size:Vec}){
 return <mesh position={at}><boxGeometry args={size}/><meshStandardMaterial color='#b7d6d8' transparent opacity={.12} roughness={.18} metalness={.12} depthWrite={false}/></mesh>;
}
function Plant({at,tall=false}:{at:Vec;tall?:boolean}){
 return <group position={at}>
   <mesh position={[0,.19,0]} castShadow><cylinderGeometry args={[.24,.19,.38,12]}/><meshStandardMaterial color='#dedcd2' roughness={.8}/></mesh>
   {[0,1,2,3,4].map(i=><mesh key={i} position={[Math.sin(i*2.4)*.18,.48+(i%3)*.16+(tall?.3:0),Math.cos(i*2.4)*.18]} rotation={[0,i,.3]} scale={[.16,tall?.5:.3,.16]} castShadow><sphereGeometry args={[1,8,6]}/><meshStandardMaterial color={i%2?'#64876a':'#3f654e'} roughness={.9}/></mesh>)}
 </group>;
}
function Chair({at,turn=0}:{at:Vec;turn?:number}){
 return <group position={at} rotation={[0,turn,0]}>
 <Block at={[0,.43,0]} size={[.48,.11,.46]} color='#455359'/>
 <Block at={[0,.73,-.23]} size={[.46,.5,.08]} color='#455359'/>
 <Block at={[0,.21,0]} size={[.06,.4,.06]} color='#737b7b'/>
 <Block at={[0,.04,0]} size={[.5,.05,.07]} color='#505b5e'/><Block at={[0,.04,0]} size={[.07,.05,.5]} color='#505b5e'/>
 </group>;
}
function Monitor({at,flip=false}:{at:Vec;flip?:boolean}){
 return <group position={at} rotation={[0,flip?Math.PI:0,0]}>
 <Block at={[0,.25,0]} size={[.62,.4,.06]} color='#34454b'/>
 <Block at={[0,.25,.035]} size={[.54,.32,.012]} color='#a0c4bd'/>
 <Block at={[-.1,.3,.045]} size={[.27,.025,.01]} color='#d4e6df'/>
 <Block at={[-.05,.23,.045]} size={[.36,.02,.01]} color='#6a9891'/>
 <Block at={[0,.02,0]} size={[.055,.12,.06]} color='#57656a'/>
 <Block at={[0,-.04,.05]} size={[.3,.025,.2]} color='#57656a'/>
 <Block at={[0,-.035,.3]} size={[.4,.025,.14]} color='#7f8d8e'/>
 </group>;
}
function Staff({at,turn=0,color='#697d90'}:{at:Vec;turn?:number;color?:string}){
 return <group position={at} rotation={[0,turn,0]}>
 <mesh position={[0,.78,0]} castShadow><capsuleGeometry args={[.15,.29,4,8]}/><meshStandardMaterial color={color}/></mesh>
 <mesh position={[0,1.13,.02]} castShadow><sphereGeometry args={[.16,12,10]}/><meshStandardMaterial color='#bc8b6c'/></mesh>
 <mesh position={[0,1.23,-.02]} scale={[1,.55,1]}><sphereGeometry args={[.165,10,8]}/><meshStandardMaterial color='#383330'/></mesh>
 {[-1,1].map(side=><group key={side}>
 <Block at={[side*.16,.74,.19]} size={[.09,.09,.38]} color={color}/>
 <Block at={[side*.09,.46,.18]} size={[.14,.14,.4]} color='#414e5d'/>
 <Block at={[side*.09,.25,.34]} size={[.13,.4,.14]} color='#414e5d'/>
 </group>)}
 </group>;
}
function Workstation({at,occupied=false,turn=0}:{at:Vec;occupied?:boolean;turn?:number}){
 return <group position={at} rotation={[0,turn,0]}>
 <Block at={[0,.72,0]} size={[1.55,.09,.83]} color={palette.oak}/>
 {[-.63,.63].map(x=><Block key={x} at={[x,.34,0]} size={[.065,.72,.65]} color='#5a6262'/>)}
 <Monitor at={[0,.83,-.12]}/><Chair at={[0,0,.72]} turn={Math.PI}/>
 {occupied&&<Staff at={[0,0,.72]} turn={Math.PI}/>}
 <Block at={[.56,.8,.14]} size={[.16,.08,.21]} color='#eee8d5'/>
 </group>;
}
function Partition({at,length,side=false}:{at:Vec;length:number;side?:boolean}){
 return <group position={at} rotation={[0,side?Math.PI/2:0,0]}>
 <Block at={[0,.29,0]} size={[length,.58,.1]} color='#e3e3dc'/>
 <Glass at={[0,1.53,0]} size={[length,1.9,.035]}/>
 <Block at={[0,2.5,0]} size={[length,.065,.09]} color={palette.frame}/>
 {[-length/2,0,length/2].map(x=><Block key={x} at={[x,1.25,0]} size={[.045,2.5,.08]} color={palette.frame}/>)}
 </group>;
}
function Reception(){
 return <group position={[-3.3,0,-2.4]}>
 <RoundedBox position={[-.3,.37,-.24]} args={[2.05,.74,1.13]} radius={.18} smoothness={3} castShadow receiveShadow><meshStandardMaterial color={palette.oak} roughness={.6}/></RoundedBox>
 <Block at={[-.3,.74,-.24]} size={[1.98,.07,1.06]} color='#e9e4d8'/>
 <Block at={[-.3,.38,.34]} size={[1.5,.055,.025]} color='#ddc49a'/>
 <Block at={[-.3,.82,-.21]} size={[.65,.04,.4]} color='#747e80'/>
 <group position={[-.3,.98,-.4]} rotation={[-.14,0,0]}><Block at={[0,0,0]} size={[.65,.38,.035]} color='#3d4d54'/><Block at={[0,0,.023]} size={[.56,.3,.008]} color='#a3c5be'/></group>
 <Chair at={[-.3,0,-1.05]}/>
 <Block at={[-.3,1.18,-1.92]} size={[2.5,2.36,.12]} color='#c4a780'/>
 {[-1.35,-1.1,-.85,-.6,-.35,-.1,.15,.4,.65].map(x=><Block key={x} at={[x,1.18,-1.83]} size={[.025,2.3,.04]} color='#ae8f69'/>)}
 <Html transform center position={[-.3,1.65,-1.76]} distanceFactor={5} style={{pointerEvents:'none'}}><div className='office-sign'><b>MK.</b><span>ENGINEERING STUDIO</span></div></Html>
 <Plant at={[-1.9,0,-1.2]} tall/>
 <Block at={[1.6,.3,.2]} size={[.85,.6,1.65]} color='#82958c'/>
 <Block at={[1.93,.65,.2]} size={[.15,.65,1.65]} color='#82958c'/>
 <Plant at={[1.65,0,-1.4]}/>
 </group>;
}
function Gallery(){
 return <group position={[3.3,0,-2.4]}>
 <Block at={[0,1.2,-1.95]} size={[4.9,2.4,.12]} color='#e6e4dd'/>
 {[-1.3,1.3].map((x,i)=><group key={x}>
 <Block at={[x,1.55,-1.85]} size={[1.95,1.05,.08]} color='#3b4c50'/>
 <Block at={[x,1.55,-1.8]} size={[1.77,.87,.025]} color={i?'#c1ad88':'#8fada1'}/>
 <Block at={[x,.38,-.65]} size={[1.4,.76,.65]} color='#c1a17c'/>
 <Block at={[x,.79,-.65]} size={[1.45,.055,.7]} color='#f1eee5'/>
 <Block at={[x,.93,-.65]} size={[.6,.22,.4]} color={i?'#556878':'#59796d'}/>
 </group>)}
 <Plant at={[2.3,0,-1.3]} tall/>
 </group>;
}
function Leadership(){
 return <group position={[-3.3,0,2.4]}>
 <Workstation at={[-1.35,0,-.7]} occupied/>
 <Workstation at={[1.35,0,-.7]} occupied/>
 <Block at={[0,.9,-1.8]} size={[2.1,.9,.08]} color='#eae9df'/>
 <Block at={[0,.9,-1.74]} size={[1.8,.03,.02]} color='#9ab5a7'/>
 <Plant at={[-2.3,0,1.4]}/>
 </group>;
}
function Lab(){
 return <group position={[3.3,0,2.4]}>
 <Workstation at={[-1.2,0,-.65]} occupied/>
 {[.55,1.7].map(x=><group key={x}>
 <Block at={[x,1.1,-1.05]} size={[.93,2.2,.72]} color='#394b54'/>
 {[0,1,2,3,4,5].map(i=><group key={i}><Block at={[x,.3+i*.32,-.67]} size={[.78,.22,.035]} color='#26383e'/><mesh position={[x+.25,.3+i*.32,-.64]}><sphereGeometry args={[.025,6,6]}/><meshStandardMaterial color='#9ad1b5' emissive='#7fc1a1' emissiveIntensity={.6}/></mesh></group>)}
 </group>)}
 <Plant at={[2.25,0,1.35]}/>
 </group>;
}
export function OfficeEnvironment({selected,onOpen}:{selected:RoomId|null;onOpen:(id:RoomId)=>void}){
 return <group>
 <RoundedBox position={[0,-.22,1.05]} args={[13.5,.4,12.15]} radius={.12} smoothness={2} receiveShadow><meshStandardMaterial color='#878f91' roughness={.9}/></RoundedBox>
 <Block at={[0,.005,1.05]} size={[13.15,.035,11.8]} color={palette.floor}/>
 {/* One connected floor plate, with clear central and transverse circulation. */}
 <Block at={[0,.03,1.05]} size={[1.1,.02,11.65]} color='#d7d8d1'/>
 <Block at={[0,.035,-.25]} size={[12.9,.02,.7]} color='#d7d8d1'/>
 <Block at={[0,.035,4.65]} size={[12.9,.02,.65]} color='#d7d8d1'/>
 {[-4.7,-3.4,-2.1,-.8,.5,1.8,3.1,4.4,5.7].map(z=><Block key={z} at={[0,.031,z]} size={[13.1,.004,.012]} color='#aeb4b3'/>)}
 <Partition at={[0,0,-4.85]} length={13.2}/>
 <Partition at={[-6.6,0,1.05]} length={11.8} side/>
 <Partition at={[6.6,0,1.05]} length={11.8} side/>
 <Partition at={[-3.9,0,6.85]} length={5.3}/><Partition at={[3.9,0,6.85]} length={5.3}/>
 {[-3.3,3.3].map(x=><Partition key={x} at={[x,0,.4]} length={5.1}/>)}
 {/* Rear room divisions leave the central aisle open. */}
 {[-3.0,2.4].map(z=><group key={z}><Partition at={[-.56,0,z]} length={3.4} side/><Partition at={[.56,0,z]} length={3.4} side/></group>)}
 <Reception/><Gallery/><Leadership/><Lab/>
 <Plant at={[-5.9,0,5.95]} tall/><Plant at={[5.9,0,5.95]} tall/>
 {rooms.map(room=><group key={room.id} position={room.position}>
 <Block at={[0,.045,0]} size={[5.15,.014,3.6]} color={room.id==='welcome'?'#c3b8a5':room.id==='works'?'#b4c0b7':room.id==='projects'?'#b4b9bb':'#adb9bc'}/>
 {selected===room.id&&<mesh rotation={[-Math.PI/2,0,0]} position={[0,.063,1.05]}><ringGeometry args={[.47,.5,40]}/><meshBasicMaterial color='#c89b55' transparent opacity={.75}/></mesh>}
 {selected===room.id&&<Html center position={[0,2.45,-1.1]} zIndexRange={[3,0]}><button className='office-exhibit' onClick={()=>onOpen(room.id)}>{room.title} <span>Details ↗</span></button></Html>}
 </group>)}
 </group>;
}
