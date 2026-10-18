'use client';
import dynamic from 'next/dynamic';
import {useCallback,useEffect,useRef,useState} from 'react';
import {caseStudies,experience,guideNarration,profile,rooms,skillGroups,type RoomId,type TourStage} from '@/data/portfolio';

const World=dynamic(()=>import('./World'),{ssr:false,loading:()=> <div className="world-loading">Preparing the office and its characters…</div>});
const steps:TourStage[]=['arrival','welcome','works','projects','skills','return','complete'];

function RoomContents({id}:{id:RoomId}){
 if(id==='works')return <div className="collection">
   {caseStudies.map(project=><article className="case" key={project.title}>
     <h3>{project.title}</h3><p>{project.description}</p>
     <div className="tags">{project.tags.map(t=><span key={t}>{t}</span>)}</div>
     {project.link&&<a href={project.link} target="_blank" rel="noopener noreferrer" className="case-link">Project website ↗</a>}
   </article>)}
 </div>;
 if(id==='projects')return <div className="collection">
   {experience.map(job=><article className="case" key={job.company}>
     <span className="tiny">{job.period}</span><h3>{job.role}</h3><strong>{job.company}</strong><p>{job.details}</p>
   </article>)}
 </div>;
 if(id==='skills')return <div className="collection">
   {skillGroups.map(group=><article className="case" key={group.title}>
     <h3>{group.title}</h3><div className="tags">{group.skills.map(s=><span key={s}>{s}</span>)}</div>
   </article>)}
 </div>;
 return <div className="collection">
   <article className="case"><span className="tiny">THE ENGINEER</span><h3>{profile.name}</h3><p>{profile.headline}</p><p>{profile.experience} of experience designing secure backend systems and guiding production delivery.</p></article>
   <article className="case"><h3>Education</h3><p>B.Tech in Computer Science & Engineering, M.A.K.A.U.T (2019), CGPA 7.97.</p></article>
   <article className="case"><h3>Connect</h3><p><a href={`mailto:${profile.email}`}>Email</a> · <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a></p></article>
 </div>;
}
export default function Tour(){
 const [stage,setStage]=useState<TourStage>('arrival');
 const [playing,setPlaying]=useState(true);
 const [replay,setReplay]=useState(0);
 const [progress,setProgress]=useState(0);
 const [simple,setSimple]=useState(false);
 const [ready,setReady]=useState(false);
 const [detail,setDetail]=useState<RoomId|null>(null);
 const [reducedMotion,setReducedMotion]=useState(false);
 const priorPlaying=useRef(false);
 const current=guideNarration[stage];
 const selected=current.room;

 const onStage=useCallback((next:TourStage)=>{setStage(next);if(next==='complete')setPlaying(false);},[]);
 const onProgress=useCallback((next:number)=>setProgress(next),[]);
 const restart=()=>{setDetail(null);setSimple(false);setStage('arrival');setProgress(0);setPlaying(true);setReplay(x=>x+1);};
 const openDetails=(id:RoomId)=>{priorPlaying.current=playing;setPlaying(false);setDetail(id);};
 const closeDetails=()=>{setDetail(null);if(priorPlaying.current && stage!=='complete'&&!simple)setPlaying(true);};
 const setTextMode=()=>{setPlaying(false);setDetail(null);setSimple(true);};
 const returnToTour=()=>{setDetail(null);setSimple(false);if(!reducedMotion&&stage!=='complete')setPlaying(true);};

 useEffect(()=>{
   setReady(true);
   const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   setReducedMotion(reduce);
   if(reduce){setSimple(true);setPlaying(false);}
 },[]);
 useEffect(()=>{
   const onKey=(e:KeyboardEvent)=>{
     if(e.key==='Escape'&&detail){closeDetails();}
     if(e.key===' '&&!detail&&!simple&&!(e.target instanceof HTMLButtonElement)){e.preventDefault();setPlaying(p=>!p);}
   };
   window.addEventListener('keydown',onKey);
   return()=>window.removeEventListener('keydown',onKey);
 },[detail,simple,stage]);

 return <main className="shell">
   <header className="top">
     <div className="brand">MK<span>.</span> PORTFOLIO</div>
     <div className="top-actions">
       <span className="desktop-hint">A GUIDED ENGINEERING JOURNEY</span>
       <button onClick={simple?returnToTour:setTextMode}>{simple?'Watch animated tour':'Read the portfolio'} ↗</button>
     </div>
   </header>
   <div className="layout">
     <aside className="side">
       <div className="tiny">YOUR OFFICE TOUR</div>
       <div className="tour-route" aria-label="Automatic tour sequence">
         {steps.map((step,i)=><div key={step} className={'tour-route-step '+(stage===step?'now ':'')+(steps.indexOf(stage)>i?'visited':'')}>
           <span className="tour-route-number">{String(i+1).padStart(2,'0')}</span>
           <div><strong>{guideNarration[step].eyebrow.split(' · ').slice(1).join(' · ')||'WELCOME'}</strong><small>{guideNarration[step].title}</small></div>
         </div>)}
       </div>
       <p className="tour-side-note">The visitor and receptionist move automatically. Watch the complete tour without choosing a room.</p>
     </aside>
     <section className="content">
       <div className="hero">
         <span className="eyebrow">WELCOME TO MY INTERACTIVE PORTFOLIO</span>
         <h1>Follow the guide.<br/><em>Explore my engineering world.</em></h1>
         <p>Meet the receptionist, tour the project gallery and engineering rooms, then return to reception. All guided automatically.</p>
       </div>
       {simple?<div className="simple-content">
         <div className="text-intro"><h2>{profile.name}</h2><p>{profile.headline}</p></div>
         {rooms.map(r=><section className="text-room" key={r.id}>
           <div className="tiny">{r.subtitle.toUpperCase()}</div><h2>{r.title}</h2><p>{r.description}</p><RoomContents id={r.id}/>
         </section>)}
       </div>:<div className="stage">
         {ready&&<World selected={selected} onSelect={openDetails} onOpen={openDetails} playing={playing} replay={replay} onStage={onStage} onProgress={onProgress}/>}
         <span className="stage-label">● AUTOMATIC GUIDED TOUR</span>
         <div className="narration" aria-live="polite" aria-atomic="true">
           <span>{current.eyebrow}</span><h2>{current.title}</h2><p>{current.description}</p>
           {stage==='complete'&&<button onClick={restart}>↻ Replay the tour</button>}
         </div>
         <div className="tour-progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Tour progress"><div style={{width:progress+'%'}}/></div>
       </div>}
       <div className="controls">
         <span>{simple?'COMPLETE PORTFOLIO':'AUTOMATIC WALKTHROUGH'} · {simple?'Accessible reading mode':progress+'% finished'}</span>
         <div className="tour-buttons">
           {!simple&&<button onClick={()=>setPlaying(p=>!p)} disabled={stage==='complete'}>{playing?'Ⅱ Pause':'▶ Resume'}</button>}
           <button onClick={restart}>↻ Replay</button>
           {!simple&&<button onClick={setTextMode}>Full details ↗</button>}
         </div>
       </div>
       {!simple&&<p className="keyboard-hint">No manual navigation required. The guide automatically returns to reception. Pause any time or open the full portfolio.</p>}
     </section>
     <aside className="right"><div className="profile">
       <div className="avatar">MK</div><span className="tiny">FEATURED ENGINEER</span>
       <h2>{profile.name}</h2><p>{profile.role}</p>
       <hr style={{border:0,borderTop:'1px solid #e8dfd0',margin:'25px 0'}}/>
       <p>“{profile.intro}”</p><p>◎ {profile.location}</p><p>✧ {profile.experience} experience</p>
       <p className="external-profile"><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a> · <a href={`mailto:${profile.email}`}>Email ↗</a></p>
     </div></aside>
   </div>
   {detail&&<div className="detail-cover" onMouseDown={(e)=>{if(e.target===e.currentTarget)closeDetails()}}>
     <section className="detail" role="dialog" aria-modal="true" aria-label={rooms.find(r=>r.id===detail)?.title+' details'}>
       <button className="close" onClick={closeDetails}>✕ Close</button>
       <span className="eyebrow">PORTFOLIO EXHIBIT</span><h2>{rooms.find(r=>r.id===detail)?.title}</h2>
       <p>{rooms.find(r=>r.id===detail)?.description}</p>
       <RoomContents id={detail}/>
       <button onClick={closeDetails}>Continue the guided tour →</button>
     </section>
   </div>}
   <footer className="footer">
     <span>© 2026 {profile.name}</span><span>BUILT WITH NEXT.JS + REACT THREE FIBER</span><span>6+ YEARS · FINTECH · SAAS · AI</span>
   </footer>
 </main>;
}
