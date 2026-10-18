const {test}=require('node:test');
const assert=require('node:assert/strict');
const ts=require('typescript');
const fs=require('node:fs');
const vm=require('node:vm');
const THREE=require('three');
function load(path,dependencies={}){
 const source=fs.readFileSync(path,'utf8');
 const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
 const context={exports:{},Math,require:name=>dependencies[name]};vm.runInNewContext(output,context);return context.exports;
}
const timeline=load('components/tourTimeline.ts');
const {cameraShot}=load('components/cameraRig.ts',{'./tourTimeline':timeline});
const camera=new THREE.PerspectiveCamera();
function project(shot,aspect,point){
 camera.aspect=aspect;camera.fov=shot.fov;camera.updateProjectionMatrix();
 camera.position.set(shot.center[0]+Math.cos(shot.orbit)*shot.radius,shot.height,shot.center[1]+Math.sin(shot.orbit)*shot.radius);
 camera.lookAt(shot.center[0],.6,shot.center[1]);camera.updateMatrixWorld();
 return new THREE.Vector3(point[0],.8,point[1]).project(camera);
}
test('portrait and desktop shots keep both touring actors inside the camera frame',()=>{
 for(const aspect of [.65,.9,1.4,1.8])for(let t=timeline.ENTRANCE_DURATION;t<=timeline.TOUR_DURATION;t+=.25){
  const shot=cameraShot(t,aspect);
  for(const role of ['visitor','guide']){const p=project(shot,aspect,timeline.personAt(t,role).point);assert.ok(Math.abs(p.x)<.85&&Math.abs(p.y)<.85,`${role} outside ${aspect} frame at ${t}`);}
 }
});
test('portrait follow shots make the actor materially larger than the opening overview',()=>{
 const t=timeline.ENTRANCE_DURATION+12;
 const follow=cameraShot(t,.75),overview=cameraShot(0,.75);
 assert.ok(follow.radius<overview.radius*.6);
 assert.ok(follow.height<overview.height*.6);
});
test('camera path remains continuous over entrance and room transitions',()=>{
 let prior=cameraShot(0,.75);
 for(let t=.05;t<=timeline.TOUR_DURATION;t+=.05){const next=cameraShot(t,.75);assert.ok(Math.hypot(next.center[0]-prior.center[0],next.center[1]-prior.center[1])<.3);assert.ok(Math.abs(next.radius-prior.radius)<.3);prior=next;}
});

test('a short phone canvas still uses the closer compact camera',()=>{
 const time=timeline.ENTRANCE_DURATION+12;
 const phone=cameraShot(time,1.2,true),desktop=cameraShot(time,1.2,false);
 assert.ok(phone.radius<desktop.radius);
 for(const role of ['visitor','guide']){const p=project(phone,1.2,timeline.personAt(time,role).point);assert.ok(Math.abs(p.x)<.85&&Math.abs(p.y)<.85);}
});
