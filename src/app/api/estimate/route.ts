import { NextRequest, NextResponse } from "next/server";
import { getDistanceInKm as getGoogleDistanceInKm } from "@/lib/google-maps";
import { getDistanceInKm as getOsmDistanceInKm } from "@/lib/osm";
import { calculateFare, getPricePerKm, type TripType } from "@/lib/pricing";

function isTripType(value: string): value is TripType {
  return value === "one_way" || value === "round_trip";
}

function getMapProvider() {
  return process.env.MAP_PROVIDER === "google" ? "google" : "openstreet";
}

export async function GET(req: NextRequest) {
  const pickup = req.nextUrl.searchParams.get("pickup")?.trim() ?? "";
  const drop = req.nextUrl.searchParams.get("drop")?.trim() ?? "";
  const tripType = req.nextUrl.searchParams.get("tripType") ?? "one_way";
  const vehicle = req.nextUrl.searchParams.get("vehicle") ?? "sedan";

  if (!pickup || !drop) {
    return NextResponse.json({ error: "Pickup and drop are required." }, { status: 400 });
  }

  if (!isTripType(tripType)) {
    return NextResponse.json({ error: "Invalid trip type." }, { status: 400 });
  }

  const provider = getMapProvider();

  if (provider === "google" && !process.env.GOOGLE_MAPS_API_KEY) {
    return NextResponse.json(
      { error: "Add GOOGLE_MAPS_API_KEY to .env.local" },
      { status: 503 },
    );
  }

  try {
    const getDistanceInKm = provider === "google" ? getGoogleDistanceInKm : getOsmDistanceInKm;
    const distanceKm = await getDistanceInKm(pickup, drop);
    const pricePerKm = getPricePerKm(tripType, vehicle);
    const estimatedPrice = calculateFare(distanceKm, tripType, vehicle);

    return NextResponse.json({
      distanceKm,
      estimatedPrice,
      pricePerKm,
      tripType,
    });
  } catch (error) {
    console.error("Estimate error", error);
    return NextResponse.json(
      { error: "Could not calculate fare. Pick locations from the suggestions." },
      { status: 500 },
    );
  }
}
