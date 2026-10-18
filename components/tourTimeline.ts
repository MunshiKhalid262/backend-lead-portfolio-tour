import type {TourStage} from '../data/portfolio';
type Point=[number,number];
export type Pose={point:Point;moving:boolean;stage:TourStage};
type Stop={point:Point;hold?:number;cue?:TourStage};
const speed=1.25;
const dist=(a:Point,b:Point)=>Math.hypot(b[0]-a[0],b[1]-a[1]);
const entrance:Stop[]=[
 {point:[0,8.5],hold:1},
 {point:[0,6.85],hold:2.3},
 {point:[0,5.5]},
 {point:[0,4.65]},
 {point:[0,-.25]},
 {point:[-3.3,-.25]},
 {point:[-3.3,-1.05],hold:4.8,cue:'welcome'}
];
const route:Stop[]=[
 {point:[-3.3,-1.05],hold:5.4,cue:'welcome'},
 {point:[-3.3,-.25]},
 {point:[0,-.25]},
 {point:[3.3,-.25]},
 {point:[3.3,-1.0],hold:9,cue:'works'},
 {point:[3.3,-.25]},
 {point:[0,-.25]},
 {point:[0,4.65]},
 {point:[-3.3,4.65]},
 {point:[-3.3,3.55],hold:9,cue:'projects'},
 {point:[-3.3,4.65]},
 {point:[0,4.65]},
 {point:[3.3,4.65]},
 {point:[3.3,3.55],hold:9,cue:'skills'},
 {point:[3.3,4.65]},
 {point:[0,4.65]},
 {point:[0,-.25]},
 {point:[-3.3,-.25]},
 {point:[-3.3,-1.05],hold:6,cue:'return'}
];
function pathDuration(nodes:Stop[]){return nodes.reduce((sum,n,i)=>sum+(n.hold??0)+(i?dist(nodes[i-1].point,n.point)/speed:0),0);}
export const ENTRANCE_DURATION=pathDuration(entrance);
export const DEPARTURE_DELAY=7;
export const FOLLOW_DELAY=1.2;
export const TOUR_DURATION=ENTRANCE_DURATION+DEPARTURE_DELAY+FOLLOW_DELAY+pathDuration(route);
function pathPose(nodes:Stop[],time:number,initial:TourStage):Pose{
 let remaining=Math.max(0,time),stage=initial;
 for(let i=0;i<nodes.length;i++){
   const n=nodes[i];
   if(i>0){
     const from=nodes[i-1].point,to=n.point;
     const duration=dist(from,to)/speed;
     if(remaining<duration){
       const t=duration?Math.max(0,Math.min(1,remaining/duration)):1;
       return {point:[from[0]+(to[0]-from[0])*t,from[1]+(to[1]-from[1])*t],moving:true,stage};
     }
     remaining-=duration;
   }
   if(n.cue)stage=n.cue;
   if(remaining<(n.hold??0))return {point:n.point,moving:false,stage};
   remaining-=n.hold??0;
 }
 return {point:nodes[nodes.length-1].point,moving:false,stage};
}
export function currentTourStage(time:number):TourStage{
 if(time>=TOUR_DURATION)return 'complete';
 if(time<ENTRANCE_DURATION)return pathPose(entrance,time,'arrival').stage;
 return pathPose(route,Math.max(0,time-ENTRANCE_DURATION-DEPARTURE_DELAY-FOLLOW_DELAY),'welcome').stage;
}
export function getTourFocus(time:number):Point{
 const visitor=personAt(time,'visitor').point,guide=personAt(time,'guide').point;
 return [(visitor[0]+guide[0])/2,(visitor[1]+guide[1])/2];
}
export function getDoorOpen(time:number){
 const approach=.35,closeAt=7;
 const up=Math.min(1,Math.max(0,(time-approach)/1.1));
 const down=Math.min(1,Math.max(0,(time-closeAt)/1.35));
 return up*(1-down);
}
export function personAt(time:number,role:'visitor'|'guide'):Pose{
 if(role==='guide'){
   const elapsed=time-ENTRANCE_DURATION;
   if(elapsed<3.2)return {point:[-3.6,-3.45],moving:false,stage:time<ENTRANCE_DURATION?'arrival':'welcome'};
   if(elapsed<DEPARTURE_DELAY){
     return pathPose([{point:[-3.6,-3.45]},{point:[-2.05,-3.45]},{point:[-2.05,-1.05]},{point:[-3.3,-1.05]}],(elapsed-3.2)/(DEPARTURE_DELAY-3.2)*4.2,'welcome');
   }
   return pathPose(route,elapsed-DEPARTURE_DELAY,'welcome');
 }
 if(time<ENTRANCE_DURATION)return pathPose(entrance,time,'arrival');
 const elapsed=Math.max(0,time-ENTRANCE_DURATION-DEPARTURE_DELAY-FOLLOW_DELAY);
 const pose=pathPose(route,elapsed,'welcome');
 // Blend the following offset at departure: no instant jump after greeting.
 const blend=Math.min(1,elapsed/.8);
 return {...pose,point:[pose.point[0]+.25*blend,pose.point[1]+.32*blend]};
}
