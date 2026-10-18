import {ENTRANCE_DURATION,TOUR_DURATION,personAt} from './tourTimeline';

const smoothstep=(a:number,b:number,t:number)=>{const x=Math.max(0,Math.min(1,(t-a)/(b-a)));return x*x*(3-2*x);};

/** Establish geography briefly, then keep the guided activity large on a phone. */
export function cameraShot(time:number,aspect:number,compact=aspect<1){
 const visitor=personAt(time,'visitor').point;
 const guide=personAt(time,'guide').point;
 const portrait=compact;
 const establish=1-smoothstep(1,5,time);
 const arrival=1-smoothstep(ENTRANCE_DURATION-7,ENTRANCE_DURATION-3,time);
 const weight=.5+arrival*.35;
 const focus=[visitor[0]*weight+guide[0]*(1-weight),visitor[1]*weight+guide[1]*(1-weight)];
 const ending=smoothstep(TOUR_DURATION-3,TOUR_DURATION,time);
 const overview=Math.max(establish,ending*.38);
 const radius=(portrait?8.2:10.5)+overview*(portrait?10:5);
 const height=(portrait?10:12)+overview*8;
 const orbit=.94+Math.sin(time*.035)*.16;
 const center:[number,number]=[focus[0]*(1-overview*.85),focus[1]*(1-overview*.85)];
 return {center,radius,height,orbit,fov:portrait?39:38,overview};
}
