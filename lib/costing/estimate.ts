import { AdminParameters, Scenario, Segment, TransportMode } from "../types";

interface SegmentInput {
  mode: TransportMode;
  distanceKm: number;
  baseRisk: number;
  regulatoryScore: number;
}

export function buildSegment(
  name: string,
  from: Segment["from"],
  to: Segment["to"],
  input: SegmentInput,
  params: AdminParameters
): Segment {
  const costPerKm =
    input.mode === "SEA"
      ? params.seaCostPerKm
      : input.mode === "AIR"
        ? params.airCostPerKm
        : params.roadCostPerKm;

  const cost = input.distanceKm * costPerKm;
  const durationDays = input.distanceKm / (input.mode === "SEA" ? 500 : 650);

  return {
    id: name,
    from,
    to,
    mode: input.mode,
    distanceKm: input.distanceKm,
    durationDays: Number(durationDays.toFixed(2)),
    cost: Number(cost.toFixed(2)),
    riskScore: input.baseRisk,
    regulatoryScore: input.regulatoryScore
  };
}

export function summarizeScenario(id: string, name: string, segments: Segment[]): Scenario {
  const totalCost = segments.reduce((sum, seg) => sum + seg.cost, 0);
  const totalDurationDays = segments.reduce((sum, seg) => sum + seg.durationDays, 0);
  const riskScore = segments.reduce((sum, seg) => sum + seg.riskScore, 0) / segments.length;
  const regulatoryScore =
    segments.reduce((sum, seg) => sum + seg.regulatoryScore, 0) / segments.length;

  return {
    id,
    name,
    segments,
    totalCost: Number(totalCost.toFixed(2)),
    totalDurationDays: Number(totalDurationDays.toFixed(2)),
    riskScore: Number(riskScore.toFixed(2)),
    regulatoryScore: Number(regulatoryScore.toFixed(2)),
    explanation: "Score calculé à partir des segments transport et contraintes réglementaires."
  };
}
