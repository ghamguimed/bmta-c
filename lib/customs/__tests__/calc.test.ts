import { calculateCif } from "../calc";

describe("calculateCif", () => {
  it("calculates CIF and taxes", () => {
    const result = calculateCif({
      productValue: 100000,
      freightCost: 12000,
      insuranceRate: 0.01,
      dutyRate: 0.05,
      vatRate: 0.1
    });

    expect(result.insuranceCost).toBeCloseTo(1000);
    expect(result.cifValue).toBeCloseTo(113000);
    expect(result.dutyAmount).toBeCloseTo(5650);
    expect(result.vatAmount).toBeCloseTo(11865);
    expect(result.totalLandedCost).toBeCloseTo(130515);
  });
});
