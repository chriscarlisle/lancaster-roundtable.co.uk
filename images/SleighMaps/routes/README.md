# Adding a Santa Sleigh route to the map

The route picker on `santas-sleigh.html` reads its list of routes from the
`SLEIGH_ROUTES` array near the bottom of that file. To add a route:

1. Get a GPX file for the route. Easiest options:
   - TurboSanta's Route Planner (draw the route, "Export Dense GPX")
   - https://gpx.studio (draw on a map, export .gpx)
2. Save the file in this folder, e.g. `carnforth.gpx`.
3. Add one entry to `SLEIGH_ROUTES` in `santas-sleigh.html`:

   ```js
   { id: 'carnforth', name: 'Carnforth', date: '3rd December 2026', time: '5:45 PM', gpx: 'images/SleighMaps/routes/carnforth.gpx' },
   ```

That's it — the "coming soon" message is automatically replaced by the
route picker/map as soon as `SLEIGH_ROUTES` has at least one entry.
