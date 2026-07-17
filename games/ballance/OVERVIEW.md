Teeter — balance-stacking on a tiltable platform
Core loop: Objects drop one at a time onto a stack sitting on a platform balanced on a central pivot (like a seesaw or spinning plate). You control the tilt — drag/mouse on desktop, tilt-to-balance on mobile — trying to keep the stack from sliding off while it grows taller.
That's it. One input (tilt), one goal (stack height), and physics does the rest.
Why the feedback loop works
Impact feedback (the "juice")

Every landing triggers screen shake scaled to collision force, a quick squash/stretch on the object, and a thud whose pitch and volume scale with impact strength. Heavy piece landing hard sounds and feels different from a light piece settling gently — no extra code logic needed, it's just tied to the physics engine's collision velocity.

Audio tension before visual failure

A rising creak plays as the tower sways past a stability threshold, so players get an audio warning cue before they see something about to topple. This turns near-disasters into tense, readable moments instead of surprise failures.

The "save" moment

If a piece teeters right at the edge and the player tilts back in time to rescue it, trigger a 0.3s slow-mo + a distinct chime + bonus points. This is your best feedback moment — it rewards skill with a genuinely different sensory beat than normal play, so players actively chase it.

Combo multiplier

Consecutive stable placements build a visible meter (glowing, filling with color). Breaking it plays a satisfying shatter/reset sound. Gives moment-to-moment stakes on top of the long-term height goal.

Escalating difficulty for free

As the tower grows, camera pulls back and the same tilt input becomes proportionally more sensitive (physics — taller stack = more torque per degree of tilt). Difficulty ramps without you scripting new rules.

The fail state is the reward

When it topples, let it fully collapse in slow-mo with a dramatic camera sweep, then tick up the score piece-by-piece with a counting sound. Losing should still feel good to watch.

Optional depth (add later, not day one)

Rotating piece queue so players can plan 1–2 moves ahead
Occasional "chaos piece" — irregular shape, high risk/high point value
Reskins that change physics (ice blocks that melt and shift weight, magnetic blocks that repel)
