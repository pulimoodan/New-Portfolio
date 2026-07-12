# PRESSURE

Hold to inflate. Release to bank. One pop ends the run.

A one-button arcade game about greed. Every balloon is worth more the longer you hold it —
and closer to bursting. Bank too early and you leave money on the table. Bank too late and
you lose everything, including every balloon you'd have banked afterwards.

## Run it

Open `index.html` in a browser. No build, no install, no dependencies.

For a local server (only needed if you later split it into modules):

```
python3 -m http.server 4321
```

## Deploy

One static file, so any of these takes about a minute:

- **Netlify Drop** — drag the folder onto https://app.netlify.com/drop
- **GitHub Pages** — push, then Settings → Pages → deploy from `main` / root
- **Vercel** — `npx vercel`
- **Cloudflare Pages** — connect the repo, no build command, output dir `.`

## The mechanic

When a balloon appears, the game rolls **one hidden number** — its burst capacity — and
never touches it again. Inflating walks a counter upward, and the balloon bursts the moment
the counter crosses that number. There is no per-frame dice roll and nothing adapts to the
player. Every death was a line you chose to walk past.

**POP RISK** is how far through the pressure range you are: 0% at rest, 100% at the maximum,
where nothing survives. Because capacity is drawn uniformly, "how deep you are" and "what
share of balloons are already dead here" are the same number — so 60% genuinely means most
balloons of this kind have burst by now. The meter is honest; it isn't theatre.

### The pop lock

Capacity is never drawn below **40%** of the meter, so the first 40% of every climb cannot
kill you. That's the ante — the part of the game you're allowed to have for free.

But you don't score it. **Points only count pressure above the lock**, so releasing exactly
at the safe line banks precisely zero. This is the load-bearing rule of the whole design:

> A guaranteed reward, repeated forever, is infinite — no matter how small it is.

An earlier build paid points for safe pressure, and the dominant strategy was to hold to the
lock, release, and farm forever without ever dying. Zeroing the safe zone turns it from free
money into a free run-up: to score at all, you have to walk into the part of the balloon that
can kill you. Simulated optimal play sits around **55%**, deep in the danger zone, and the
optimum is broad and flat (45–65% all score within ~10% of each other) so there's no single
number to memorise.

### The two forces

Reward grows as `pressure^1.55`. The exponent above 1.0 is the whole trick: each moment you
hold is worth *more than the one before it*. Meanwhile survival decays linearly as you climb
the danger band. You are multiplying an **accelerating** reward by a **decaying** survival
chance — that product rises, peaks, then collapses, and the peak is the game.

The **bank multiplier** (+15% per consecutive bank) is what makes it a *run* rather than a
series of independent bets: a pop doesn't just cost the pot on screen, it costs every future
balloon at your hard-earned multiplier. That's why optimal play is more cautious than any
single-balloon analysis suggests. The real stake is always the whole run.

### The ramp

Each balloon lowers the maximum capacity, so the range shrinks: balloons get more fragile,
the same pressure sits deeper in the danger band, and the safe zone (40% of a shrinking
range) narrows in absolute terms too. Your multiplier climbs while your margin narrows.
Eventually the two meet.

## Feel

The parts that aren't mechanics, and why they're there:

- **The string** is a 16-point verlet rope — it hangs, swings, lags behind the balloon, and
  drops free when you pop. It's the only real physics in the game.
- **The tide** — risk is drawn as a gradient flooding the screen from the floor, so danger
  arrives in peripheral vision while your eyes stay on the balloon. It freezes on death at
  the level you died at.
- **The burst** throws three kinds of debris — a few big curled *flaps* of skin, torn
  *ribbons*, and a fast cloud of tiny *flecks* — each with its own drag and gravity, so they
  don't all move alike. Everything is long and narrow on purpose: any large smooth round red
  shape reads as gore rather than latex.
- **Hitstop** — the world freezes for 75ms on the burst, then everything lets go at once.
  It's the single biggest reason the pop feels like an impact instead of objects changing
  velocity.

## Tuning

All of it lives in the `T` object at the top of the script.

| knob | effect |
|---|---|
| `baseInflate` | pure pacing — pot and odds key off pressure, not time, so this changes speed without touching the economy |
| `popLock` | how much of each balloon is unkillable (and unscoreable) |
| `capMax` / `capMaxPerLvl` | the burst range, and how fast it tightens per balloon |
| `valueExp` | the greed curve — higher rewards bravery harder |
| `streakStep` | multiplier gained per bank; raise it to make survival matter more |

If you change the economy, re-derive the optimal strategy before shipping it. It is very
easy to accidentally create a risk-free way to score, and players will find it.
