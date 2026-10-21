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

test('custom last-pick chances control selection and wheel sizes', () => {
  for (const last of roles) {
    for (const chance of [0, 10, 25, 50]) {
      const weights = weightsFor(last, chance);
      assert.equal(weights[roles.indexOf(last)], chance);
      assert.ok(Math.abs(weights.reduce((sum, weight) => sum + weight, 0) - 100) < 1e-9);
      const sectors = sectorsFor(last, chance);
      for (const [i, sector] of sectors.entries()) {
        assert.ok(Math.abs(sector.end - sector.start - weights[i] * 3.6) < 1e-9);
        if (weights[i] > 0) assert.equal(chooseRole(last, sector.center / 360, chance), sector.role);
      }
      const picks = Array.from({length: 600}, (_, i) => chooseRole(last, (i + .5) / 600, chance));
      assert.equal(picks.filter(role => role === last).length, chance * 6);
    }
  }
  assert.deepEqual(weightsFor(null, 50), [25, 25, 25, 25]);
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
