const {test}=require('node:test');
const assert=require('node:assert/strict');
const ts=require('typescript');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('components/tourTimeline.ts','utf8');
const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const context={exports:{},Math};vm.runInNewContext(output,context);
const {TOUR_DURATION,ENTRANCE_DURATION,currentTourStage,personAt,getDoorOpen}=context.exports;
test('all stages occur in order and completion is reachable at the clamped end',()=>{
 const stages=[];for(let t=0;t<TOUR_DURATION;t+=.05){const s=currentTourStage(t);if(stages.at(-1)!==s)stages.push(s);}
 assert.deepEqual(stages,['arrival','welcome','works','projects','skills','return']);
 assert.equal(currentTourStage(TOUR_DURATION),'complete');
 for(const role of ['guide','visitor']){const p=personAt(TOUR_DURATION,role);assert.equal(p.moving,false);assert.equal(p.stage,'return');}
});
test('actor paths have no teleports, including the greeting and departure boundaries',()=>{
 for(const role of ['guide','visitor'])for(let t=.01;t<=TOUR_DURATION;t+=.01){const a=personAt(t-.01,role).point,b=personAt(t,role).point;assert.ok(Math.hypot(a[0]-b[0],a[1]-b[1])<.04,`${role} jumps at ${t}`);}
});
test('door stays open while visitor crosses the threshold and closes later',()=>{
 let crossed=false;for(let t=0;t<ENTRANCE_DURATION;t+=.01){const z=personAt(t,'visitor').point[1];if(Math.abs(z-6.85)<.4){crossed=true;assert.ok(getDoorOpen(t)>.8,`door too closed at ${t}`);}}
 assert.ok(crossed);assert.equal(getDoorOpen(20),0);
});
