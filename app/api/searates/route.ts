import { NextResponse } from "next/server";
import { fetchFreightIndex, fetchPortsByCountry, fetchRoutePlanner } from "../../../lib/searates/client";

export async function POST(request: Request) {
  const payload = await request.json();

  try {
    if (payload.type === "ports") {
      const ports = await fetchPortsByCountry(payload.country);
      return NextResponse.json({ ports, source: "searates" });
    }

    if (payload.type === "route") {
      const route = await fetchRoutePlanner(payload.route);
      return NextResponse.json({ route, source: "searates" });
    }

    if (payload.type === "freight-index") {
      const index = await fetchFreightIndex();
      return NextResponse.json({ index, source: "searates" });
    }

    return NextResponse.json({ message: "unknown request" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: "SeaRates unavailable", fallback: true }, { status: 503 });
  }
}
