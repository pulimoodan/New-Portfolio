# BALANCE

Load a boat without losing the cargo. Crates drop onto the deck one at a time; drag to trim the
boat left or right and keep the growing cargo from sliding into the sea. One cargo loss ends the
run — you sail home with whatever you'd already stacked.

A one-input physics game about greed and nerves. Every crate you land is a taller, heavier
load riding lower in the water, and the same lean tips her further. The boat balances on its
own buoyancy like a seesaw: the higher the stack, the more a small trim becomes a big roll.

## Run it

Open `index.html` in a browser. No build, no install, no dependencies — one static file.

For a local server (only needed if you later split it into modules):

```
python3 -m http.server 4321
```

## Deploy

One file, so any of these takes about a minute:

- **Netlify Drop** — drag the folder onto https://app.netlify.com/drop
- **GitHub Pages** — push, then Settings → Pages → deploy from `main` / root
- **Vercel** — `npx vercel`
- **Cloudflare Pages** — connect the repo, no build command, output dir `.`

## Controls

- **Desktop** — drag or move the mouse left/right to trim the boat. Arrow keys (or `A`/`D`)
  heel her fully one way. `Space` casts off and sails again.
- **Mobile** — drag across the screen to trim. If your device reports orientation, stop
  dragging and it hands over to **tilt-to-balance** — physically tip the phone to trim.

## The mechanic

There is no scripted difficulty. It all falls out of one honest 2D rigid-body simulation.

- The **boat** is a thin immovable deck (infinite mass) pivoting about its own roll centre at
  the waterline; the hull is art hung around it. You don't set the heel angle directly — you
  set a *target*, and she chases it like a critically-damped spring, so a flick overshoots and
  she feels like she has weight in the water.
- Because the deck's rotation is real angular velocity, **friction carries the cargo along**
  when you trim. Crates grip the deck right up until the slope beats the grip — then they slide
  toward the low rail and over into the sea.
- **Cargo is the goal.** Each landed crate is one more shipped. As the load grows the camera
  pulls back to keep it framed, which quietly makes the same trim read as a bigger roll —
  the ramp is free, nobody scripted it.

Every lost cargo run is a slope you chose to heel past.

## The four feedback beats

The physics is the game; the feel is what makes it *land*. Everything below keys off the
simulation, not off timers.

**Impact.** A piece hitting the stack triggers screen shake, a squash-and-stretch on the
piece, and a thud whose pitch and volume scale with the collision speed. A piece dropped from
height lands heavier — in sound, in feel, in the shake — with no special-case code, because
it's all just tied to the contact velocity.

**The creak.** A wood-groan rises as the stack's centre of mass drifts off the fulcrum, so
your *ear* warns you a beat before your *eye* sees a piece start to leave. Near-disasters
become tense, readable moments instead of surprise topples.

**The save.** Tip the tower deep into the danger zone and pull it back before it goes — the
world drops into slow-motion, a chime plays, and you bank a bonus. It's a genuinely different
sensory beat from normal play, so you start chasing it on purpose. This is the best moment in
the game and it only exists because the danger reading is continuous and honest.

**The combo.** Consecutive clean placements build a multiplier (the tower rims gold). Scare
yourself — sway past the danger line — and it shatters and resets. Long-term height goal,
moment-to-moment stakes.

The **cargo loss** is meant to be watched, not skipped: she rolls all the way over in slow-mo,
the cargo spills into the sea and sinks, the water floods up over the wreck, and the score
ticks up crate by crate with a counting sound. Losing should still feel good.

## The physics, briefly

It's a compact Box2D-in-miniature, because a stacking game lives or dies on stack stability.

- **Collision** — SAT across the four candidate axes finds the least-penetration direction,
  then reference/incident **face clipping** produces a proper 1- or 2-point contact manifold.
  The two-point manifold on a resting face is the whole reason a stack sits *still* instead
  of buzzing.
- **Solver** — sequential impulses with a Coulomb friction cone (`μ·Pn`), a dozen iterations
  a substep, and Baumgarte bias to push overlap out gently. Restitution is zero: boxes for
  stacking shouldn't bounce.
- **Fixed timestep** — physics runs at a fixed 120 Hz regardless of frame rate, so a slow
  frame can't tunnel a fast-falling piece through the beam, and slow-mo is just a smaller
  time-scale fed into the same loop.

Around 30 boxes max, O(n²) broadphase with an AABB reject — trivially cheap at that size.

## Feel notes

- **Danger is one number** — the horizontal drift of the cargo's centre of mass off the roll
  centre, plus a touch of raw heel so the warning anticipates. That single value drives the
  creak's pitch, **the sea itself**, the combo break, and the save. Nothing on screen can
  disagree with itself about how close she is to going.
- **The sea carries the danger.** As the load leans, the water climbs the hull, darkens, and
  gets choppier — the low rail dips under and she starts shipping water. It's a literal,
  physical version of the balloon game's rising tide, so the two games share a language.
- **Cargo lost** is the fail made to be watched: the hull rolls all the way over in slow-mo,
  the cargo spills into the sea and goes under (translucent water draws over it), and the flood
  climbs to swallow the wreck while the score ticks up.
- **The camera** only zooms — the waterline stays pinned near the bottom — so a tall load
  shrinks upward and stays readable, and the perceived stakes grow with the cargo.

## Tuning

All of it lives in the `T` object at the top of the script.

| knob | effect |
|---|---|
| `G` | gravity — how fast a dropped piece slams down |
| `maxTilt` | the hard limit on how far you can tip the beam |
| `tiltStiff` / `tiltDamp` | the beam's spring — lower stiffness = floatier, laggier steering |
| `mu` | friction — how hard crates grip the deck before they slide. This is the balance |
| `waterline` | where the calm sea sits; lower it and she rides with less freeboard |
| `velIters` / `beta` / `slop` | solver stiffness and how eagerly it pushes overlap out |
| `dangerOn` / `dangerSafe` / `saveDepth` | where the creak fires, where combo breaks, how deep a save must go |
| `comboStep` / `saveBonus` | the reward economy |

Raise `mu` and the tower forgives a steeper tilt; drop it and the game turns to ice. Change
one number and the whole difficulty curve moves — which is the point of building it on physics
instead of rules.
