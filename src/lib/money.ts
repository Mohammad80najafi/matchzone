// lib/money.ts
export const toTomansLabel = (rials: number) =>
  Math.floor((rials || 0) / 10).toLocaleString('fa-IR') + ' تومان';
