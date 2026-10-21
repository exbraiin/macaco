export const roles = ['ADC', 'MID', 'JUNGLE', 'TOP'];
export const weightsFor = last => roles.map(role => last ? (role === last ? 10 : 30) : 25);
export function chooseRole(last, random = Math.random()) {
  const weights = weightsFor(last);
  let cumulative = 0;
  return roles.find((role, i) => { cumulative += weights[i]; return random * 100 < cumulative; }) ?? roles[3];
}
