# New Portfolio

## Analytics

Every game reports to Google Analytics (GA4) through a shared helper in
`scripts/analytics.js`, loaded on every game page:

```html
<script src="/scripts/analytics.js"></script>
```

It exposes `window.trackGame(event, gameName, params)`, which wraps `gtag`
and always tags the event with `game_name`.

### Events

Each game fires two events:

```js
// once when a run starts
trackGame('game_start', '<game_name>');

// once when a run ends
trackGame('game_end', '<game_name>', {
  score,
  duration_sec: Math.round((performance.now() - runStartedAt) / 1000),
});
```

`game_start` counts total plays (including runs that get abandoned).
`game_end` counts completed runs and carries the score/duration data.
Comparing the two counts gives a rough drop-off rate.

### GA4 custom definitions

Registered once in GA4 Admin → Custom definitions, so `score`/`duration_sec`
aggregate properly and `game_name` is filterable:

| Type | Name | Event parameter |
|---|---|---|
| Dimension | Game Name | `game_name` |
| Metric | Score | `score` |
| Metric | Duration sec | `duration_sec` |

GA4 does not allow the same event parameter to be registered as both a
dimension and a metric — pick one. `score`/`duration_sec` are metrics (you
want sum/average); `game_name` is a dimension (you filter/group by it).

### Verifying events fire

1. Serve the repo locally (`python3 -m http.server 4321`) — analytics.js is
   loaded with an absolute path (`/scripts/analytics.js`), which does not
   resolve under `file://`.
2. Temporarily add `{ debug_mode: true }` to the `gtag("config", ...)` call
   in `scripts/analytics.js`.
3. Play the game, then check GA4 Admin → DebugView for `game_start` /
   `game_end` events streaming in. Click an event to see its parameters.
4. Remove `debug_mode: true` before committing/deploying.

## Adding a new game

1. Create `games/<name>/index.html` (or a folder with its own assets).
2. Include the shared analytics script:
   ```html
   <script src="/scripts/analytics.js"></script>
   ```
3. Wire up the two events at the run's start/end points:
   ```js
   let runStartedAt = 0;

   function startRun() {
     // ...existing reset logic...
     runStartedAt = performance.now();
     if (window.trackGame) trackGame('game_start', '<name>');
   }

   function endRun() {
     // ...existing game-over logic...
     if (window.trackGame) {
       trackGame('game_end', '<name>', {
         score,
         duration_sec: Math.round((performance.now() - runStartedAt) / 1000),
       });
     }
   }
   ```
   Use the same `<name>` consistently as the `game_name` value.
4. Add an entry to `games.json` in the repo root — this is what the
   homepage fetches to render the game cards:
   ```json
   {
     "slug": "<name>",
     "title": "<Display Title>",
     "tagline": "<short tagline>",
     "emoji": "🎮",
     "gradient": "linear-gradient(135deg, #hex1, #hex2)",
     "line": "<one-line description>"
   }
   ```
   Use the same `<name>` as `slug` here and as the `game_name` value passed
   to `trackGame` — they don't have to match technically, but keeping them
   identical makes it trivial to line up GA4 data with the homepage listing.
5. Verify events in DebugView (see above) before shipping.

No new GA4 custom definitions are needed per game — `game_name`, `score`,
and `duration_sec` are shared across all games, and a new game just becomes
a new value of `game_name`.
