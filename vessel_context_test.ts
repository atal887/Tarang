import { resolveFishermanContext } from './src/services/contextResolver';

const cases = [
  { query: "Can my boat go tomorrow?",           defaultBoat: "non_motorized",  expectBoat: "non_motorized" },
  { query: "Can my boat go tomorrow?",           defaultBoat: "motorized",      expectBoat: "motorized"     },
  { query: "Can my boat go tomorrow?",           defaultBoat: "mechanized",     expectBoat: "mechanized"    },
  { query: "Can my motorized boat go tomorrow?", defaultBoat: "non_motorized",  expectBoat: "motorized"     },
  { query: "Can my mechanized boat go tomorrow?",defaultBoat: "motorized",      expectBoat: "mechanized"    },
];

let passed = 0;
let failed = 0;

for (const c of cases) {
  const ctx = resolveFishermanContext({
    query: c.query,
    defaultLocationName: "Mumbai",
    defaultBoatType: c.defaultBoat
  });
  const ok = ctx.boatType === c.expectBoat;
  if (ok) {
    console.log(`✓  "${c.query}" + default:${c.defaultBoat} → resolved:${ctx.boatType}`);
    passed++;
  } else {
    console.error(`✗  "${c.query}" + default:${c.defaultBoat} → expected:${c.expectBoat} got:${ctx.boatType}`);
    failed++;
  }
}

console.log(`\nPassed: ${passed}  Failed: ${failed}`);
if (failed > 0) process.exit(1);
