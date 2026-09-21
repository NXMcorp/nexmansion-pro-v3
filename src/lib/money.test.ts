import { describe, it, expect } from "vitest";
import { calculatePrice, serviceLinePrice, nightsBetween, formatMoney } from "./money";

describe("calculatePrice", () => {
  it("computes a simple 3-night price", () => {
    const p = calculatePrice({
      nightlyRateMinor: 100000, // €1000
      nights: 3,
      cleaningFeeMinor: 20000,
      serviceFeePct: 0,
      taxPct: 10,
      platformCommissionPct: 2,
      currency: "EUR",
    });
    expect(p.nightsSubtotalMinor).toBe(300000);
    expect(p.cleaningFeeMinor).toBe(20000);
    expect(p.taxMinor).toBe(Math.round((300000 + 20000) * 0.1));
    expect(p.platformFeeMinor).toBe(Math.round(300000 * 0.02));
    expect(p.totalMinor).toBe(320000 + p.taxMinor);
    expect(p.hostNetMinor).toBe(300000 + 20000 - p.platformFeeMinor);
  });

  it("never produces float precision issues at scale", () => {
    const p = calculatePrice({
      nightlyRateMinor: 123456,
      nights: 13,
      cleaningFeeMinor: 34567,
      serviceFeePct: 5,
      taxPct: 11,
      platformCommissionPct: 2,
      servicesMinor: 9999,
      currency: "EUR",
    });
    expect(Number.isInteger(p.totalMinor)).toBe(true);
    expect(Number.isInteger(p.taxMinor)).toBe(true);
    expect(Number.isInteger(p.serviceFeeMinor)).toBe(true);
    expect(Number.isInteger(p.platformFeeMinor)).toBe(true);
  });

  it("formats money as euros", () => {
    expect(formatMoney(123400, "EUR", "en-GB")).toMatch(/1|234/);
  });
});

describe("serviceLinePrice", () => {
  it("respects per-guest and per-day models", () => {
    expect(serviceLinePrice(1000, "FIXED", 1, 4, 3)).toBe(1000);
    expect(serviceLinePrice(1000, "PER_GUEST", 1, 4, 3)).toBe(4000);
    expect(serviceLinePrice(1000, "PER_DAY", 1, 4, 3)).toBe(3000);
    expect(serviceLinePrice(1000, "PER_TRIP", 2, 4, 3)).toBe(2000);
  });
});

describe("nightsBetween", () => {
  it("calculates whole nights correctly", () => {
    expect(nightsBetween(new Date("2026-06-01"), new Date("2026-06-06"))).toBe(5);
  });
});
