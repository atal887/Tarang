import { resolveFishermanContext } from './src/services/contextResolver.js';

const cases = [
  { query: "Is it safe to take my canoe out in Vypīn tomorrow morning?", defaultLoc: "Mumbai", defaultBoat: "motorized" },
  { query: "Can I go fishing today?", defaultLoc: "Mumbai", defaultBoat: "motorized" }
];

cases.forEach(c => {
  console.log("Query:", c.query);
  console.log(resolveFishermanContext({
    query: c.query,
    defaultLocationName: c.defaultLoc,
    defaultBoatType: c.defaultBoat
  }));
  console.log("---");
});
