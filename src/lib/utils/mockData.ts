export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomDateWithinDays(days = 30) {
  const ms = Date.now() - Math.floor(Math.random() * days * 24 * 60 * 60 * 1000);
  return new Date(ms).toISOString().slice(0, 10);
}
