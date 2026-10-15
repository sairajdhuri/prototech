# Lighting and material revision

Direction: the user's supplied `public/pcbref.png`, with explicit emphasis on lighting, shadows, depth, and realism. The previous procedural circuit drawing did not supply enough material detail or lighting contrast.

The new board uses generated PCB surface artwork with separate packed height, roughness, and metalness channels. Copper and solder mask respond differently to the broad warm studio light. Layer faces use the key light's shadow map to approximate softbox occlusion. Semi-transparent dielectric cores, plated hole sleeves, and alignment pins add physical depth. Floor shadows soften and fade into the new photographic studio backdrop. The existing real-time scroll assembly remains.

New generated assets: `pcb-surface-v2.webp` and `pcb-studio-v2.webp`. Both were created with imagegen from the supplied visual reference and are identified as illustrations on `/credits`. No third-party stock assets or dependencies were added. Matching stack and finished-board fallback posters were rendered from the updated scene.

Screenshots at 1440, 768, and 390 pixels were opened and reviewed. The original navigation markup matches its saved baseline. No horizontal overflow or browser page errors were observed. One multi-page development preview timed out during WebGL initialization; the isolated mobile rerun and browser regression passed.

Validation: ESLint and TypeScript passed. All four focused browser regressions passed after the final material changes: reduced motion, assembly/reversal/remount, fallback quote action, and mobile layer placement. The production build is checked separately.

Remaining limit: the renderer approximates area-light shadows using the directional key's shadow map. It is not an offline path-traced reproduction of the reference. Performance has not been measured on a physical low-end phone.
