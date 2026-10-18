# Office tour review — 18 October 2026

## Verification boundary
The production site was opened twice in the requested cloud Chrome browser. Both attempts ended in a client-side application exception. Console: `THREE.WebGLRenderer: Error creating WebGL context`; underlying context reports `GL_RENDERER = Disabled`. This is a limitation of this browser, and also exposes missing failure containment in the application. No entrance, greeting, room-visit or final-return animation was visually observed. Do not describe the source review or timeline tests as a completed visual walkthrough.

## Prioritized findings and changes

| Priority | Finding | Change / next action |
| --- | --- | --- |
| P0 | Failed renderer crashes the entire portfolio | WebGL2 preflight and scene error boundary switch to readable portfolio |
| P0 | Clock clamps at duration but completion requires a later time; follower delay excluded | Include departure/follow delays, complete at clamped endpoint; regression tests |
| P1 | Narration advances before delayed actors | Follow visitor stage timing |
| P1 | Guide seated in front of reception, away from chair/laptop | Seat behind desk, align chair, lower desk/laptop to character scale, add side aisle departure |
| P1 | Full orbit eventually views rooms through opaque back walls | Elevated bounded orbit from open facade; portrait-aware field of view |
| P1 | Opaque glass panel and poorly timed door opening | Transparent material, open before approach, test threshold clearance |
| P1 | Straight rigid legs during sitting and walking | Add knee joints; blend thigh/knee posture during standing |
| P1 | Instant follower offset and progress drift | Blend offset; unified tested timeline; explicit 100% completion |
| P1 | Reception desk duplicated; central gallery sofa obstructs actors | Remove duplicates/obstruction and narrow visitor offset |
| P1 | Narration covers lower scene/entrance | Place narration below canvas in stage layout |
| P2 | Contact shadows recomputed every frame | Remove the extra contact-shadow pass; retain dynamic directional shadows to avoid baked actor silhouettes |
| P2 | Replay inherits damped scene state | Remount scene on replay |

## Remaining work toward a polished architectural cartoon
1. Use original or licensed rigged glTF characters with elbows, wrists, eyelids, brows and mouth blendshapes. Current capsule figures remain stylized primitives.
2. Animate heel strike, planted foot stance, toe-off, hip counter-rotation and deceleration. Add foot IK and collision capsules. Knee bending alone does not establish grounded locomotion.
3. Add an explicit approach/reach/grasp/push/release door action. Current door is proximity-timed; it is not a verified hand-to-handle interaction.
4. Add chair roll-back, hands pushing off, weight shift, standing and turning clips. Current standing remains procedural.
5. Author turn anticipation and conversational eye contact; point at specific exhibit positions instead of using generic gestures.
6. Tune glass reflections, exposure and shadow softness on an actual WebGL renderer. Measure frame timing and draw calls before making performance claims.
7. Consider a true 360-degree orbit only with camera-aware wall cutaways/occlusion handling and shot-specific framing.

## Preview deployment
The Vercel GitHub check succeeded for the branch. Opening the preview redirects to Vercel authentication. The connected Vercel account returned 403 for the owning team, including its temporary-access lookup. Preview application rendering and after screenshots remain blocked.

## Required visual acceptance pass (not yet completed)
Desktop 1440×900 and phone 390×844, plus a real Android device:
- Capture entrance, seated receptionist, greeting, departure, each of three room visits, final return and complete state.
- Confirm hands align with laptop/handle, feet do not slide, knees clear desk/chair, actors face each other and clear all furniture.
- Pause during walking: actor poses and camera must settle/freeze acceptably. Resume without a time jump. Replay from every stage.
- Confirm portrait framing keeps both characters and doorway visible; narration and labels never hide actors or overlap.
- Check reduced motion, WebGL unavailable, reading mode and room-detail controls.
- Record median and p95 frame times, scene draw calls, memory and device details. No frame-rate benchmark was possible in this cloud browser.

## Automated coverage
`npm test` checks ordered stages, reachable completion, both actors stopped at the endpoint, continuous paths sampled every 10 ms, and open-door clearance while crossing. `npm run typecheck` and `npm run build` validate TypeScript/Next.js. These checks do not establish visual quality or mobile rendering.

Production must remain unchanged until owner approval. All changes belong on `fix/cinematic-tour-reliability`.
