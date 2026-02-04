export interface SeaRatesPort {
  name: string;
  locode: string;
  lat: number;
  lng: number;
}

export async function fetchPortsByCountry(country: string) {
  const apiKey = process.env.SEARATES_API_KEY;
  if (!apiKey) {
    return [] as SeaRatesPort[];
  }

  const response = await fetch(`https://api.searates.com/ports?country=${country}`, {
    headers: {
      "X-API-Key": apiKey
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("SeaRates port lookup failed");
  }

  return (await response.json()) as SeaRatesPort[];
}

export async function fetchRoutePlanner(payload: Record<string, unknown>) {
  const apiKey = process.env.SEARATES_API_KEY;
  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://api.searates.com/route", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey
    },
    body: JSON.stringify(payload),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("SeaRates route planner failed");
  }

  return response.json();
}

export async function fetchFreightIndex() {
  const apiKey = process.env.SEARATES_API_KEY;
  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://api.searates.com/freight-index", {
    headers: {
      "X-API-Key": apiKey
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("SeaRates freight index failed");
  }

  return response.json();
}
