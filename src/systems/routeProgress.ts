export const routeProgress = (progressPx: number, lengthPx: number): number => {
  if (lengthPx <= 0) return 0;
  return Math.min(1, Math.max(0, progressPx / lengthPx));
};
