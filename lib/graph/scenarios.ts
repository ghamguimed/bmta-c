import { AdminParameters, NodePoint, Scenario } from "../types";
import { buildSegment, summarizeScenario } from "../costing/estimate";

interface ScenarioInput {
  origin: NodePoint;
  destination: NodePoint;
  ports: NodePoint[];
  params: AdminParameters;
  waypoint?: NodePoint | null;
}

export function generateScenarios(input: ScenarioInput): Scenario[] {
  const { origin, destination, ports, params, waypoint } = input;
  const originPort = ports[0];
  const destinationPort = ports[ports.length - 1];

  const roadDistance = calculateDistance(origin, destination) + 120;
  const roadSegments = [
    buildSegment(
      "road-only",
      origin,
      destination,
      { mode: "ROAD", distanceKm: roadDistance, baseRisk: 0.4, regulatoryScore: 0.5 },
      params
    )
  ];

  if (waypoint) {
    roadSegments.push(
      buildSegment(
        "road-waypoint",
        waypoint,
        destination,
        { mode: "ROAD", distanceKm: roadDistance * 0.35, baseRisk: 0.5, regulatoryScore: 0.5 },
        params
      )
    );
    roadSegments[0] = buildSegment(
      "road-first",
      origin,
      waypoint,
      { mode: "ROAD", distanceKm: roadDistance * 0.65, baseRisk: 0.4, regulatoryScore: 0.5 },
      params
    );
  }

  const seaSegments = [
    buildSegment(
      "road-to-port",
      origin,
      originPort,
      { mode: "ROAD", distanceKm: 350, baseRisk: 0.3, regulatoryScore: 0.4 },
      params
    ),
    buildSegment(
      "sea-leg",
      originPort,
      destinationPort,
      { mode: "SEA", distanceKm: 5200, baseRisk: 0.35, regulatoryScore: 0.6 },
      params
    ),
    buildSegment(
      "last-mile",
      destinationPort,
      destination,
      { mode: "ROAD", distanceKm: 280, baseRisk: 0.45, regulatoryScore: 0.5 },
      params
    )
  ];

  const airSegments = [
    buildSegment(
      "road-airport",
      origin,
      destination,
      { mode: "AIR", distanceKm: roadDistance * 0.7, baseRisk: 0.2, regulatoryScore: 0.7 },
      params
    )
  ];

  return [
    summarizeScenario("road", "Route uniquement", roadSegments),
    summarizeScenario("sea-road", "Mer + route", seaSegments),
    summarizeScenario("air-road", "Air + route", airSegments)
  ];
}

function calculateDistance(a: NodePoint, b: NodePoint) {
  const rad = (value: number) => (value * Math.PI) / 180;
  const r = 6371;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const lat1 = rad(a.lat);
  const lat2 = rad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(h));
}
