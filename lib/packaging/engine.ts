import { PackagingResult } from "../types";

interface PackageProfile {
  id: string;
  lengthM: number;
  widthM: number;
  heightM: number;
  weightKg: number;
  cbm: number;
  requiresLongContainer?: boolean;
}

const unitV1: PackageProfile[] = [
  { id: "pkg-1", lengthM: 1.2, widthM: 0.8, heightM: 1.9, weightKg: 320, cbm: 1.82 },
  { id: "pkg-2", lengthM: 1.5, widthM: 1.0, heightM: 2.0, weightKg: 420, cbm: 3.0 },
  { id: "pkg-3", lengthM: 2.2, widthM: 1.2, heightM: 2.2, weightKg: 580, cbm: 5.81 },
  { id: "pkg-4", lengthM: 2.8, widthM: 1.3, heightM: 2.4, weightKg: 730, cbm: 8.74 },
  { id: "pkg-5", lengthM: 3.6, widthM: 1.5, heightM: 2.6, weightKg: 900, cbm: 14.04 },
  { id: "pkg-6", lengthM: 6.0, widthM: 1.6, heightM: 2.6, weightKg: 1100, cbm: 24.96, requiresLongContainer: true }
];

const CONTAINER_CAPACITY = {
  "20ft": { cbm: 33, maxLengthM: 5.9 },
  "40ft": { cbm: 67, maxLengthM: 12.0 }
};

export function packagingEngine(units: number): PackagingResult {
  const packages = units;
  const selectedPackages = Array.from({ length: units }, (_, index) => unitV1[index % unitV1.length]);

  const totalCbm = selectedPackages.reduce((sum, pkg) => sum + pkg.cbm, 0);
  const totalWeightKg = selectedPackages.reduce((sum, pkg) => sum + pkg.weightKg, 0);
  const requiresLong = selectedPackages.some((pkg) => pkg.requiresLongContainer);

  const minContainerType = requiresLong ? "40ft" : "20ft";
  const chosenCapacity = CONTAINER_CAPACITY[minContainerType];
  const count = Math.max(1, Math.ceil(totalCbm / chosenCapacity.cbm));

  const justification = requiresLong
    ? "La présence de pièces de 6m nécessite un conteneur 40ft compatible."
    : "Le volume total est compatible avec un conteneur 20ft."

  return {
    packages,
    totalCbm: Number(totalCbm.toFixed(2)),
    totalWeightKg: Number(totalWeightKg.toFixed(1)),
    recommendedContainers: {
      type: minContainerType,
      count,
      justification
    }
  };
}
