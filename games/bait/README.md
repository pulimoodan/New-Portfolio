# BAIT

You are the food. Six snakes want you. You never attack.

Normal snake: you eat, you grow, you crash into yourself. Here you're the fruit at the other
end of that — the snakes hunt you, the snakes grow, and the only way to kill one is to stand
somewhere it can't corner out of.

## Run it

Open `index.html` in a browser. No build, no install, no dependencies.

Analytics is loaded from an absolute path, so if you want the events to fire, serve the repo
root rather than opening the file directly:

```
python3 -m http.server 4321
```

## Deploy

Not one file, unlike the others — the folder carries `scream.m4a` alongside `index.html`, so
deploy the directory rather than the page:

- **Netlify Drop** — drag the folder onto https://app.netlify.com/drop
- **GitHub Pages** — push, then Settings → Pages → deploy from `main` / root
- **Vercel** — `npx vercel`
- **Cloudflare Pages** — connect the repo, no build command, output dir `.`

The audio is loaded relative to the page (`scream.m4a`), so it survives being served from a
subpath. The analytics script is not — it's an absolute `/scripts/analytics.js`, which means
the site has to be served from the domain root for events to fire.

## Controls

| | |
|---|---|
| WASD / arrows | move (free, analogue — you are not on the grid) |
| Shift / Space / click | dash |
| touch | drag anywhere to steer; **tap with a second finger to dash** |

No dash button on mobile. One thumb holds the stick, any other finger tapping anywhere is the
dash — nothing sits on top of the board, nothing to reach for, and unlike a double-tap it
can't misfire while you re-grip the stick. The charge arc above the hero's head is the only
readout.

## The mechanic

A snake picks a direction **once per grid cell** and can only go straight, left, or right.
Never backwards. You move freely and you're faster than every one of them except RED. That
asymmetry is the whole game: you can curve, they can only choose a corner, and a corner
chosen badly is a corner they die in.

There are no walls. Every edge is a **seam** — walk off the right and you come back on the
left, and so do they. Nothing can be cornered in here, which cuts both ways: there's no cheap
escape for you either, and every death is a shape somebody walked into.

So a snake only dies three ways, and all of them are geometry:

- its head hits **its own body**
- its head hits **another snake's body**
- two heads hit **each other**

You cause those by being somewhere that makes the greedy choice a fatal one. Circle a long
snake tightly and it wraps itself. Lead two of them onto the same lane and they solve the
problem for you.

### They grow, and that's your weapon

Fruit is on the board for you (+1) and for them (8 body segments). A fed snake is longer
*and* thicker — it fills its lane, and a snake that fills its lane runs out of corners. Early
green snakes are harmless. The same snake four fruit later is a wall that follows you.

Kills are worth 10–23 and multiply with the chain (capped at x8), so a run lands in the
hundreds rather than the tens of thousands. Fruit you grab yourself is small change; the
score is in what you get them to do to each other.

**Dead snakes explode into fruit**, which is the reward and the next problem at once: every
snake still alive now sprints at the pile you happen to be standing in. That's where the
chain reactions come from.

## The cast

Each one is separated by how it *fails*, not how it chases.

| | speed | behaviour | how it dies |
|---|---|---|---|
| **GREEN** | slow | walks straight at you, no spatial sense at all | its own coils |
| **YELLOW** | quick | cuts corners the instant a turn helps | overcommits into traffic |
| **BLUE** | medium | looks 4 cells ahead, values having somewhere to go | hardly ever — bait it into another snake |
| **RED** | very fast | hisses, then lunges; can't turn at all mid-lunge | dodge the lunge, it eats whatever's behind you |
| **SILVER** | fast | aims where you're *going*, not where you are | double back and its prediction is a wall |
| **PURPLE** | fast | doesn't chase — cuts across your escape line | outlast it in open space |

The two knobs that actually differentiate them are `care` (how much a lethal cell scares it)
and `space` (whether it does a flood fill to check it isn't boxing itself in). GREEN and RED
have zero `space`, which is why they die of their own enthusiasm. BLUE has the most, which is
why you'll need help killing it.

## Spider sense

Rings pulse out from you, the whole board slowly flushes red, and a chipmunk starts screaming.
All three scale with how close the nearest snake is, and all three are peripheral information
on purpose — in a wrapping arena the thing about to reach you may be entering from the
opposite edge, and you shouldn't have to be looking at it to feel it.

The scream is `scream.m4a`, looped. Four synthesised versions were tried first and every one
of them was wrong: a sonar ping (unnoticeable), a one-shot yell (honking), a properly wobbled
vocal-synth cry (a siren doing an impression of a mouth), and a flat saturated one (closer,
still synthetic). A recording won.

How it's wired, in case the clip is ever swapped:

- the bytes are fetched at page load; decoding waits for the `AudioContext`, which can't
  exist until the player touches something
- it loops **0.85s → 2.95s**, not the whole file — the clip takes a breath around 3.1s and
  looping across that gap turns one continuous scream into a stutter. Re-point `SCREAM_IN` /
  `SCREAM_OUT` at the sustained stretch of whatever replaces it.
- `playbackRate` rides the danger (0.95 → 1.45), so the closer the snake, the more the poor
  thing sounds like a chipmunk. Volume rides it too.
- if the fetch or the decode fails — an old browser without AAC, a bad deploy — it falls back
  to the synthesised scream that's still in the file. Silence would lose the mechanic.

⚠️ **The clip is a rip of a well-known meme sound effect and is not licensed for
redistribution.** It's fine locally; if this ever gets real traffic, replace it with your own
recording (your phone's voice memo app is genuinely all it takes) or something from Freesound
under a permissive licence. Nothing else has to change.

## Feel

The parts that aren't mechanics, and why they're there:

- **Hitstop** — the world stops dead for 70ms on a kill, then a third of a second of slow
  motion. It's the single biggest reason a kill lands like an impact instead of a snake
  quietly disappearing.
- **The hop** — no legs, no scampering. One phase drives height, squash on the floor, stretch
  at the peak, a lean into the run, and a hard smear along a dash. The shadow stays on the
  ground and shrinks as the hero leaves it, which is what sells the hop as *height* rather
  than wobble. It's also the honest hitbox: the shadow is where you actually are.
- **Telegraphed spawns** — an arrow flashes on the edge for ~0.9s (1.5s for the opening two)
  before anything comes through. Being eaten by something that materialised behind you isn't
  difficulty, it's noise.
- **The freeze** — the moment you die everything stops: snakes, spawns, the red tide, the
  score. What's on screen is the arrangement that killed you, held still.
- **Bullet time** — when a head passes within a hair of you the game briefly drops to 42%
  speed. On a 1.5s cooldown, so a swarm doesn't turn the whole run to syrup.

## Tuning

Everything lives in the `T` object and the `TYPES` table at the top of the script.

| knob | effect |
|---|---|
| `liveBase` / `livePer` / `liveCap` | how big the crowd is and how fast it grows |
| `boardCap()` / `fruitQuota()` | crowd and fruit measured in *cells*, so a phone board isn't wall-to-wall snake |
| `growPerFruit` / `maxLen` | how quickly a snake becomes a hazard |
| `hunger` (per type) | how far it'll detour for fruit instead of for you |
| `care` / `space` (per type) | how hard it is to kill; drop both and it suicides in seconds |
| `chainCap` | the ceiling on pile-up scoring |

Two things learned the hard way while balancing this, both worth keeping in mind if you touch
the AI:

1. A snake that only steers off its own position turns too late and dies to nothing. It has to
   look at least a turn ahead, or the player never gets to do anything.
2. On a wrapping board, "far away" and "just off the other edge" are the same place. Every
   distance in here is measured across the seam as well as through the middle.

## Not built (yet)

The design doc has more in it than this: hazards (lava, spikes, ice, teleporters), powerups
(ghost, freeze, magnet, pepper, banana peel, fake fruit), bosses (hydra, ouroboros, king
snake), and 4-player. All of it was cut to keep one idea legible — you, them, and the shape
you leave them.

Anyone want to argue for the banana peel?
