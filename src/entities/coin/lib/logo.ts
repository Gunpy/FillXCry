// Deterministic fallback identity for assets whose logo image is missing or fails to load,
// mirroring the design's monogram-in-a-tinted-circle. Same symbol → same hue, every render.

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function logoHue(symbol: string): number {
  return hashString(symbol) % 360;
}

export function monogram(symbol: string): string {
  const cleaned = symbol.replace(/[^A-Za-z0-9]/g, '');
  return (cleaned[0] ?? '?').toUpperCase();
}
