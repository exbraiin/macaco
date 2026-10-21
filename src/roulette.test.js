import {test} from 'node:test';
import assert from 'node:assert/strict';
import {roles, weightsFor, chooseRole} from './roulette.js';
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
