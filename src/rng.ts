// Deterministic seeded PRNG (Mulberry32) with xfnv1a hash for string seeds.
export function xfnv1a(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(a: number) {
  return function() {
    let t = (a += 0x6D2B79F5) | 0;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeRng(seed?: string | number) {
  let s: number;
  if (typeof seed === 'number') s = seed >>> 0;
  else if (typeof seed === 'string') s = xfnv1a(seed);
  else s = (Math.random() * 2**32) >>> 0;
  const rand = mulberry32(s);
  return {
    int: (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min,
    float: () => rand(),
    shuffle<T>(arr: T[]): T[] {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }
  };
}
