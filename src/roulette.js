export const roles = ['ADC', 'MID', 'JUNGLE', 'TOP'];
export const weightsFor = (last, lastChance = 10) => roles.map(role => last ? (role === last ? lastChance : (100 - lastChance) / 3) : 25);
export function chooseRole(last, random = Math.random(), lastChance = 10) {
  const weights = weightsFor(last, lastChance);
  let cumulative = 0;
  return roles.find((role, i) => { cumulative += weights[i]; return random * 100 < cumulative; }) ?? roles[3];
}

export function sectorsFor(last, lastChance = 10) {
  let start = 0;
  return weightsFor(last, lastChance).map((weight, i) => {
    const end = start + weight * 3.6;
    const sector = {role: roles[i], start, end, center: (start + end) / 2};
    start = end;
    return sector;
  });
}
