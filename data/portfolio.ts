export type RoomId = 'welcome' | 'works' | 'projects' | 'skills';
export type TourStage = 'arrival' | 'welcome' | 'works' | 'projects' | 'skills' | 'return' | 'complete';
export const profile = {
 name:'Munshi Md Khalid',
 role:'Senior Backend Lead · Python · Laravel · Node.js',
 headline:'Engineering secure backend platforms for fintech, SaaS and AI.',
 location:'Kolkata, India',
 experience:'6+ years',
 email:'munshikhalid262@gmail.com',
 github:'https://github.com/MunshiKhalid262',
 intro:'I build secure, scalable APIs and take systems from architecture through production delivery.'
};
export const rooms:{id:RoomId;title:string;subtitle:string;color:string;position:[number,number,number];description:string}[]=[
{id:'welcome',title:'Reception',subtitle:'Introduction',color:'#edbd78',position:[-3.3,0,-2.4],description:'Meet Khalid, a Senior Backend Lead with 6+ years of experience across fintech, SaaS and AI-driven products.'},
{id:'works',title:'Project Gallery',subtitle:'Fintech, AI and SaaS',color:'#a4c5b1',position:[3.3,0,-2.4],description:'Explore CANPAY, AktionAI, Gaming Hub, Atlas and Jalyoga—production systems with challenging APIs and integrations.'},
{id:'projects',title:'Leadership Studio',subtitle:'Experience and delivery',color:'#cbb8d7',position:[-3.3,0,2.4],description:'From Junior Backend Developer to Senior Backend Lead: architectural decisions, technical documentation and production ownership.'},
{id:'skills',title:'Engineering Lab',subtitle:'Technology toolkit',color:'#a6c9d9',position:[3.3,0,2.4],description:'Python, Django, FastAPI, Laravel, Node.js, SQL and MongoDB, AWS, Redis, Docker, CI/CD, and AI/LLM integrations.'}
];
export type CaseStudy={title:string;description:string;tags:string[];link:string|null};
export const caseStudies:CaseStudy[]=[
{title:'Gaming Hub — Multi-Tenant SaaS',description:'Architected a white-label SaaS platform from scratch with isolated AWS RDS tenant databases, Lambda provisioning, secure role-based APIs, Redis caching and Node.js services.',tags:['Laravel','Node.js','Python','AWS RDS','Redis','Lambda'],link:null},
{title:'CANPAY — Fintech Payments',description:'Built B2B2C APIs integrating ACH payment rails, banking systems, authentication, validation and audit-trail logging.',tags:['Fintech','PHP/Laravel','Python','MySQL','Docker'],link:'https://canpaydebit.com'},
{title:'AktionAI — AI Platform',description:'Developed AI-driven backends with Django and FastAPI patterns, GPT-4/Groq integrations, MongoDB logging and Jira task automation.',tags:['Python','Django','FastAPI','GPT-4','Groq','MongoDB'],link:'https://aktionai.com'},
{title:'Atlas — Real Estate',description:'Integrated external services and Stripe/Razorpay payment gateways. SQL query optimisation improved API response times by 20%.',tags:['Laravel','Payments','MySQL','Performance'],link:null},
{title:'Jalyoga — Live Booking',description:'Built Python/Django APIs for real-time bookings, class scheduling, live availability and concurrent session handling.',tags:['Python','Django','Scheduling','REST APIs'],link:'https://jalyoga.com.sg'}
];
export const experience=[
{role:'Senior Backend Lead',company:'Swordfield Technologies Pvt Ltd',period:'Jan 2026 – Present',details:'Multi-tenant SaaS architecture, secure APIs, Node.js Web3 microservices and Dev → UAT → Production deployment workflows.'},
{role:'Software Developer',company:'Red Apple Technologies Pvt Ltd',period:'Aug 2025 – Dec 2025',details:'Backend ownership for a gaming and social platform, REST APIs, integrations and feature delivery.'},
{role:'Software Engineer',company:'Blue Copper Technologies Pvt Ltd',period:'Apr 2022 – Jul 2025',details:'CANPAY fintech integrations, AktionAI platform APIs, audit logging, tests and production deployments.'},
{role:'PHP Web Developer (Tech Lead)',company:'Iksen India Pvt Ltd',period:'Jun 2021 – Mar 2022',details:'Atlas real-estate and e-commerce APIs, Stripe/Razorpay, SQL performance work and Linux deployment.'},
{role:'Junior Backend Developer',company:'Techminda Inc Pvt Ltd',period:'Jul 2019 – May 2021',details:'Learning Connect and Jalyoga APIs, Python/Django scheduling and booking workflows.'}
];
export const skillGroups=[
{title:'Backend and security',skills:['Python','FastAPI','Django','PHP/Laravel','Node.js','REST APIs','JWT','Sanctum','Audit logging']},
{title:'Cloud and databases',skills:['MySQL','PostgreSQL','MongoDB','Redis','AWS EC2','RDS','Lambda','S3','ElastiCache','EventBridge']},
{title:'Delivery, frontend and AI',skills:['Docker','Linux','CI/CD','React','Next.js','Vue.js','Unit testing','Claude Agents','GPT-4','Groq','Gemini']}
];
export const guideNarration:Record<TourStage,{eyebrow:string;title:string;description:string;room:RoomId|null}>={
arrival:{eyebrow:'01 · ARRIVAL',title:'The tour begins',description:'A visitor enters the office and walks to reception, where the guide is ready to welcome them.',room:null},
welcome:{eyebrow:'02 · RECEPTION',title:'Welcome to the engineering studio',description:'Meet Khalid: a Senior Backend Lead building reliable APIs, fintech systems and multi-tenant platforms.',room:'welcome'},
works:{eyebrow:'03 · PROJECT GALLERY',title:'Explore the work',description:'Our first stop: CANPAY financial transactions, AktionAI intelligent workflows and Gaming Hub multi-tenant architecture.',room:'works'},
projects:{eyebrow:'04 · LEADERSHIP STUDIO',title:'How the engineer grew',description:'More than six years across five roles, from hands-on backend APIs to leading architecture and production delivery.',room:'projects'},
skills:{eyebrow:'05 · ENGINEERING LAB',title:'Inside the toolkit',description:'Python, FastAPI, Django, Laravel, Node.js, SQL, AWS, Redis and modern delivery tooling power these systems.',room:'skills'},
return:{eyebrow:'06 · RETURN',title:'Back to reception',description:'The guide escorts the visitor back to the reception desk to complete the visit.',room:'welcome'},
complete:{eyebrow:'07 · THANK YOU',title:'The tour is complete!',description:'Thanks for visiting. Replay the guided tour or explore the full technical experience and project details.',room:'welcome'}
};
