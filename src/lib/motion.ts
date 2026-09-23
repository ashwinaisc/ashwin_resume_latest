export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
export const shortestDelta = (from: number, to: number) => ((to - from + 180) % 360 + 360) % 360 - 180;
export const frontIndex = (angle: number, count: number) => count ? ((Math.round(-angle / (360 / count)) % count) + count) % count : 0;
