import { AdminParameters } from "../types";

export interface CustomsInput {
  productValue: number;
  freightCost: number;
  insuranceRate: number;
  dutyRate: number;
  vatRate: number;
}

export interface CustomsBreakdown {
  cifValue: number;
  insuranceCost: number;
  dutyAmount: number;
  vatAmount: number;
  totalLandedCost: number;
}

export function calculateCif(input: CustomsInput): CustomsBreakdown {
  const insuranceCost = input.productValue * input.insuranceRate;
  const cifValue = input.productValue + input.freightCost + insuranceCost;
  const dutyAmount = cifValue * input.dutyRate;
  const vatAmount = (cifValue + dutyAmount) * input.vatRate;
  const totalLandedCost = cifValue + dutyAmount + vatAmount;

  return {
    cifValue,
    insuranceCost,
    dutyAmount,
    vatAmount,
    totalLandedCost
  };
}

export function resolveCustomsRates(
  params: AdminParameters,
  country: string,
  hsCode?: string
) {
  const countryConfig = params.countries.find((entry) => entry.country === country);
  const dutyRate =
    (hsCode && countryConfig?.dutiesByHs[hsCode]) ??
    countryConfig?.dutiesByHs["default"] ??
    params.dutyDefault;
  const vatRate = countryConfig?.vatRate ?? params.vatDefault;

  return {
    dutyRate,
    vatRate,
    documents: countryConfig?.documents ?? [],
    restrictions: countryConfig?.restrictions ?? []
  };
}
