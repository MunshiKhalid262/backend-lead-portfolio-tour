# Reference office and mobile cinematography

## Design
The supplied office reference guides the architecture: a single connected floor, charcoal-framed glass, neutral concrete and oak, reception branding, staffed workstations, planting and unobstructed circulation. This is a procedural 3D interpretation, not an exact reproduction of the reference or a photorealistic render.

Replaces the four disconnected pastel room platforms and tall opaque room walls with a continuous office floor and transparent partitions. Retains the established automatic visitor/receptionist itinerary and the three portfolio exhibits. Adds reception seating, laptop, desks, monitors, chairs, seated background staff, gallery plinths and equipment racks. Tour paths stay in the central/transverse aisles and clear the new workstation areas.

## Camera and phone layout
- Establishing view for the first seconds, then an eased close follow camera.
- Camera follows the visitor during arrival and smoothly blends to both actors for greeting and room visits.
- Portrait follow distance is 8.2 horizontal units and height 10, replacing the previous portrait radius 28 and height 22. Field of view is 39 degrees. Compact mode follows canvas width under 600px, so a shorter phone canvas still uses the closer camera.
- Elevated bounded orbit preserves open-face visibility; no manual room selection is needed.
- Camera and glass door stop updating their pose when the tour clock stops.
- Phone stage uses 62svh, clamped to 365–540px, replacing a fixed 620px stage. Narration stays below the canvas. Header text, step chips and controls are more compact.
- Figure baseline matches the new raised floor to reduce floating at rest.

## Verification
Seven automated tests cover ordered tour stages, endpoint completion, path continuity, door clearance, both actors inside the computed portrait/desktop camera frame, closer portrait follow distance, and smooth camera transition targets. Camera projection tests sample aspect ratios 0.65, 0.9, 1.4 and 1.8; they are mathematical checks, not screenshots or device tests.

TypeScript and Next.js build checks pass. The cloud browser in this session has WebGL disabled. Actual lighting, glass sorting, clipping, mobile frame rate, and visual composition remain unverified. Preview access was protected in the preceding iteration; do not claim a complete browser walkthrough.

## Remaining quality work
Use authored rigged character clips, facial expressions, grounded foot placement and explicit hand-to-door interaction to reach the requested semi-realistic cartoon animation quality. Current background staff are static seated figures. The visitor and guide retain their procedural animations.

Keep this redesign on a review branch until approval to merge.
