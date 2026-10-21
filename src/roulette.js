export const roles = ['ADC', 'MID', 'JUNGLE', 'TOP'];
export const weightsFor = last => roles.map(role => last ? (role === last ? 10 : 30) : 25);
export function chooseRole(last, random = Math.random()) {
  const weights = weightsFor(last);
  let cumulative = 0;
  return roles.find((role, i) => { cumulative += weights[i]; return random * 100 < cumulative; }) ?? roles[3];
}

export function sectorsFor(last) {
  let start = 0;
  return weightsFor(last).map((weight, i) => {
    const end = start + weight * 3.6;
    const sector = {role: roles[i], start, end, center: (start + end) / 2};
    start = end;
    return sector;
  });
}
