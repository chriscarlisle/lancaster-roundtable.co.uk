# Live sleigh tracking — setup

This is a lighter, standalone version of what TurboSanta does — it doesn't
need their Google Sheet or Apps Script, just two free services: **Firebase**
(holds the live GPS position) and a **Cloudflare Worker** (a small proxy that
keeps the admin key off the public website). Once both are set up, the live
marker on the route map and the driver's beacon page just work.

## 1. Firebase — create the project

1. Go to https://firebase.google.com, create a project.
2. Build → Realtime Database → Create Database → Region: Europe.
3. Copy the **Database URL** (looks like
   `https://your-project-default-rtdb.europe-west1.firebasedatabase.app`).
4. Realtime Database → Rules, paste this (replace `YOUR_WRITE_SECRET`
   with a password of your choosing — this is what the driver types into
   the beacon page each night):

   ```json
   {
     "rules": {
       ".read": false,
       ".write": false,
       "location": {
         "current": {
           "$secret": {
             ".write": "$secret === 'YOUR_WRITE_SECRET'"
           }
         }
       }
     }
   }
   ```

   Nothing is publicly readable — only a write matching the exact secret is
   allowed, and only to that one path. The public site never talks to
   Firebase directly at all; that's what the Worker below is for.

5. Project Settings (gear icon) → Service Accounts → Database secrets →
   copy the **Database secret** (a different, longer value — this is an
   admin key, keep it out of any client-side code).

## 2. Cloudflare Worker — the public read-proxy

1. https://dash.cloudflare.com → free account if you don't have one.
2. Workers & Pages → Create Worker → give it a name → Deploy → Edit Code.
3. Delete the default code, paste in [`cloudflare-worker.js`](cloudflare-worker.js) from this folder → Deploy.
4. Worker → Settings → Variables → add two **encrypted** variables:
   - `FIREBASE_URL` = the Database URL from step 1.3
   - `FIREBASE_DB_SECRET` = the Database secret from step 1.5
5. Copy the Worker's own URL, e.g. `https://sleigh-tracker.yourname.workers.dev`.

## 3. Wire it into the site

- In `santas-sleigh.html`, find `LIVE_TRACKING` near the bottom and set:

  ```js
  const LIVE_TRACKING = {
      workerUrl: 'https://sleigh-tracker.yourname.workers.dev',
  };
  ```

- In `sleigh-beacon.html`, find `BEACON_CONFIG` and set:

  ```js
  const BEACON_CONFIG = {
      firebaseUrl: 'https://your-project-default-rtdb.europe-west1.firebasedatabase.app',
  };
  ```

  Note there's no `writeSecret` field here — the driver still types the
  password into the beacon page each night, but it's checked by the
  Firebase rule from step 1.4 alone, server-side. Deliberately don't add
  a copy of the real secret into this file: anything in this file ships
  to every visitor's browser and is readable via view-source, even on an
  unlinked page. If the secret ever does end up hardcoded here, treat it
  as compromised — change the Firebase rule to a new value rather than
  just editing the file.

  This secret only grants *write* access to one small path — even if it
  leaked, nobody could read anything back with it (reading only works
  through the Worker's admin key, which never leaves Cloudflare).

## On the night

Whoever's phone is going out with the sleigh opens `sleigh-beacon.html`,
taps Start. Keep the screen on and the tab in the foreground — mobile
browsers pause GPS in background tabs. The public route map picks up the
live position automatically within a few seconds and shows a pulsing red
marker; it disappears again about 90 seconds after the beacon stops
sending (so it doesn't show a stale position for the rest of the night).

## Cost

Both Firebase Realtime Database (Spark/free plan) and Cloudflare Workers
(free plan, 100,000 requests/day) comfortably cover a single sleigh
tracked by a village's worth of visitors at zero cost.
