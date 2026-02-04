import { packagingEngine } from "../engine";

describe("packagingEngine", () => {
  it("recommends 40ft containers when long pieces exist", () => {
    const result = packagingEngine(6);

    expect(result.recommendedContainers.type).toBe("40ft");
    expect(result.recommendedContainers.count).toBeGreaterThanOrEqual(1);
  });
});
