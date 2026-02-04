export type TransportMode = "ROAD" | "SEA" | "RAIL" | "AIR";

export interface NodePoint {
  id: string;
  name: string;
  type: "factory" | "port" | "hub" | "destination" | "waypoint";
  lat: number;
  lng: number;
}

export interface Segment {
  id: string;
  from: NodePoint;
  to: NodePoint;
  mode: TransportMode;
  distanceKm: number;
  durationDays: number;
  cost: number;
  riskScore: number;
  regulatoryScore: number;
}

export interface Scenario {
  id: string;
  name: string;
  segments: Segment[];
  totalCost: number;
  totalDurationDays: number;
  riskScore: number;
  regulatoryScore: number;
  explanation: string;
}

export interface PackagingResult {
  packages: number;
  totalCbm: number;
  totalWeightKg: number;
  recommendedContainers: {
    type: "20ft" | "40ft";
    count: number;
    justification: string;
  };
}

export interface CountryConfig {
  country: string;
  vatRate: number;
  dutiesByHs: Record<string, number>;
  documents: string[];
  restrictions: string[];
}

export interface AdminParameters {
  insuranceRate: number;
  roadCostPerKm: number;
  seaCostPerKm: number;
  airCostPerKm: number;
  portDelayDays: number;
  vatDefault: number;
  dutyDefault: number;
  countries: CountryConfig[];
}
