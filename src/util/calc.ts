import { combatRateModifier, Location } from "kolmafia";
import { clamp, getModifier, sum } from "libram";

export function turnsToSeeNoncombat(combatRate: number, encounters = 1) {
  const noncombatRate = 1 - (combatRate + combatRateModifier()) / 100;
  return noncombatRate > 0
    ? Math.ceil(encounters / noncombatRate)
    : Number.POSITIVE_INFINITY;
}

// How many turns until we see this NC? Includes the turn spent on the NC.
// Cap should be the number of encounters ("clicks") before the next click guarantees the NC, including that click.
// For forcenoncombat zones, this is the forcenoncombat value + 1.
export function turnsToSeeSingleNoncombatCapped(
  combatRate: number,
  cap: number,
  progress = 0,
) {
  const p = 1 - (combatRate + combatRateModifier()) / 100;
  cap -= progress;
  if (cap <= 0 || p >= 1) return 1;
  if (p <= 0) return cap;
  return (1 / p) * (1 - Math.pow(1 - p, cap));
}

export function turnsToSeeSingleNoncombat(location: Location) {
  const p = 1 - location.combatPercent / 100;
  if (location.forceNoncombat <= 0) {
    return 1 / p;
  }
  const progress = clamp(
    location.turnsSpent - location.lastNoncombatTurnsSpent,
    0,
    location.forceNoncombat,
  );
  const cap = location.forceNoncombat + 1 - progress;
  if (cap <= 0 || p >= 1) return 1;
  if (p <= 0) return cap;
  return (1 / p) * (1 - Math.pow(1 - p, cap));
}

export function monsterLevelWithPercent() {
  return (
    getModifier("Monster Level") *
    (1 + getModifier("Monster Level Percent") / 100)
  );
}

export function range(hi: number): number[];
export function range(lo: number, hi: number): number[];
export function range(m: number, n?: number): number[] {
  const lo = n === undefined ? 0 : m;
  const hi = n === undefined ? m : n;
  return [...Array(Math.max(0, hi)).keys()].slice(lo);
}

export function factorialQuotient(n: number, k: number): number {
  if (!Number.isSafeInteger(n) || n < 0 || !Number.isSafeInteger(k) || k < 0) {
    throw new Error(
      "Can't take factorial of anything but a nonnegative integer.",
    );
  }
  return n <= k ? 1 : n * factorialQuotient(n - 1, k);
}

export function factorial(n: number): number {
  return factorialQuotient(n, 1);
}

export function binomialCoefficient(n: number, k: number): number {
  const hi = Math.max(k, n - k);
  const lo = Math.min(k, n - k);
  return factorialQuotient(n, hi) / factorial(lo);
}

// What is the probability we get exactly needed successes in trials trials?
export function binomialPdf(needed: number, trials: number, p: number): number {
  if (needed > trials) return 0;
  p = clamp(p, 0, 1);
  return (
    binomialCoefficient(trials, needed) *
    Math.pow(p, needed) *
    Math.pow(1 - p, trials - needed)
  );
}

// What is the probability we get at least needed successes in trials trials?
export function binomialAtLeast(
  needed: number,
  trials: number,
  p: number,
): number {
  return sum(range(needed, trials + 1), (n) => binomialPdf(n, trials, p));
}

export function bitCount(n: number): number {
  n = n - ((n >> 1) & 0x55555555);
  n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
  return (((n + (n >> 4)) & 0xf0f0f0f) * 0x1010101) >> 24;
}
