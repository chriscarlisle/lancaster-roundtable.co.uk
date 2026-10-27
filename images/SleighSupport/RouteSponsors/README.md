# Adding a route sponsor

The Route Schedule cards on `santas-sleigh.html` read sponsor info from the
`ROUTE_SCHEDULE` array near the bottom of that file. To add a sponsor to a
route:

1. Save their logo in this folder, e.g. `acme-ltd.png` (a square-ish logo
   works best — it's shown in a 56x56px box).
2. Add a `sponsor` field to that route's entry in `ROUTE_SCHEDULE`:

   ```js
   { id: 'carnforth', name: 'Carnforth', date: '9th December 2026', time: 'Time TBC',
     sponsor: { name: 'Acme Ltd', logo: 'images/SleighSupport/RouteSponsors/acme-ltd.png',
                url: 'https://acme-ltd.example.com' } },
   ```

   `url` is optional — if the sponsor has a website or a social media page,
   add it and their logo + name both become links that open it in a new
   tab. Leave it out and they just show as plain text/image.

Routes without a `sponsor` field just show "Sponsor to be announced" and no
logo — nothing else needs to change.

## The Give Back Community Day entry

This one works differently — it's accepting bids rather than having a fixed
sponsor yet:

- `bidFormUrl`: set this to your Google Form link once you have one. Until
  then the "Submit a Bid" button falls back to a mailto enquiry.
- `winningBid`: once a bid is chosen, set this to
  `{ sponsorName: 'Their Name', details: 'What they won / any details' }`
  and the card automatically swaps the bid button for the result.
