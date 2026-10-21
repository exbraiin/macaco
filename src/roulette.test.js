import {test} from 'node:test';
import assert from 'node:assert/strict';
import {roles, weightsFor, chooseRole, sectorsFor} from './roulette.js';
test('first spin has four equal chances', () => {
  assert.deepEqual(weightsFor(null), [25,25,25,25]);
  assert.deepEqual([.125,.375,.625,.875].map(n=>chooseRole(null,n)),roles);
});
test('each last pick gets exactly 10 percent and others get 30', () => {
  for (const last of roles) {
    const counts = Object.fromEntries(roles.map(r=>[r,0]));
    for (let i=0;i<10000;i++) counts[chooseRole(last,(i+.5)/10000)]++;
    for (const role of roles) assert.equal(counts[role],role===last?1000:3000);
  }
});

test('wheel sections match the odds and contain the matching selections', () => {
  for (const last of [null, ...roles]) {
    const sectors = sectorsFor(last);
    assert.equal(sectors[0].start, 0);
    assert.equal(sectors.at(-1).end, 360);
    sectors.forEach((sector, i) => {
      assert.ok(Math.abs(sector.end - sector.start - weightsFor(last)[i] * 3.6) < 1e-9);
      assert.equal(chooseRole(last, sector.center / 360), sector.role);
      if (i) assert.equal(sector.start, sectors[i - 1].end);
    });
  }
});
