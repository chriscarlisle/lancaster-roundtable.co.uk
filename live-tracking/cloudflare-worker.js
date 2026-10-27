// Cloudflare Worker — the public read-proxy for Santa's live GPS location.
//
// The browser (santas-sleigh.html) polls THIS Worker, never Firebase directly.
// This Worker holds the Firebase admin "Database secret" as an encrypted
// environment variable and uses it to read the location server-side — that
// secret is never sent to, or visible from, any visitor's browser.
//
// Deploy:
//   1. dash.cloudflare.com -> Workers & Pages -> Create Worker -> paste this file -> Deploy.
//   2. Worker -> Settings -> Variables -> add two "Secret" (encrypted) variables:
//        FIREBASE_URL         e.g. https://your-project-default-rtdb.europe-west1.firebasedatabase.app
//        FIREBASE_DB_SECRET   Firebase console -> Project Settings -> Service Accounts -> Database secrets
//   3. Copy the Worker's own URL (https://xxx.yyy.workers.dev) into LIVE_TRACKING.workerUrl
//      in santas-sleigh.html.
//
// See ../live-tracking/README.md for the full setup, including the matching
// Firebase security rules and the beacon page that writes the location.

export default {
  async fetch(request, env) {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    };

    try {
      const url = `${env.FIREBASE_URL}/location/current.json?auth=${env.FIREBASE_DB_SECRET}`;
      const res = await fetch(url);
      const data = await res.json();

      // location/current holds { "<write-secret>": { lat, lng, ts } } — the
      // beacon page writes under its own secret key so Firebase rules can
      // lock the write down without the secret ever being readable by the
      // public. We strip that key name out here and just return the value.
      const entry = data ? Object.values(data)[0] : null;

      if (!entry || typeof entry.lat !== 'number' || typeof entry.lng !== 'number') {
        return new Response(JSON.stringify({ lat: null, lng: null, ts: 0 }), { headers });
      }

      return new Response(JSON.stringify({ lat: entry.lat, lng: entry.lng, ts: entry.ts || 0 }), { headers });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'unavailable' }), { status: 502, headers });
    }
  }
};
