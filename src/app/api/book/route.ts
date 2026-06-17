import { NextRequest, NextResponse } from "next/server";
import { notifyEmail, notifyTelegram } from "@/lib/booking-notifications";
import { getDistanceInKm as getGoogleDistanceInKm } from "@/lib/google-maps";
import { getDistanceInKm as getOsmDistanceInKm } from "@/lib/osm";
import { calculateFare, getPricePerKm, type TripType } from "@/lib/pricing";

const TRIP_LABELS: Record<TripType, string> = {
  one_way: "One Way",
  round_trip: "Round Trip",
};

function isTripType(value: string): value is TripType {
  return value === "one_way" || value === "round_trip";
}

function getMapProvider() {
  return process.env.MAP_PROVIDER === "google" ? "google" : "openstreet";
}

interface BookingRequestBody {
  name: string;
  phone: string;
  pickup: string;
  drop: string;
  travelDate: string;
  tripType: TripType;
  pickupTime?: string;
  vehicle?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as BookingRequestBody;

    if (
      !body.name ||
      !body.phone ||
      !body.pickup ||
      !body.drop ||
      !body.travelDate ||
      !body.tripType
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!isTripType(body.tripType)) {
      return NextResponse.json(
        { error: "Invalid trip type. Choose One Way or Round Trip." },
        { status: 400 },
      );
    }

    const provider = getMapProvider();
    if (provider === "google" && !process.env.GOOGLE_MAPS_API_KEY) {
      return NextResponse.json(
        { error: "Add GOOGLE_MAPS_API_KEY to .env.local" },
        { status: 503 },
      );
    }

    const getDistanceInKm = provider === "google" ? getGoogleDistanceInKm : getOsmDistanceInKm;
    const distanceKm = await getDistanceInKm(body.pickup, body.drop);
    const vehicle = body.vehicle ?? "sedan";
    const price = calculateFare(distanceKm, body.tripType, vehicle);
    const pricePerKm = getPricePerKm(body.tripType, vehicle);

    await Promise.all([
      notifyTelegram(body, distanceKm, price),
      notifyEmail(body, distanceKm, price),
    ]).catch((error) => {
      console.error("Notification error", error);
    });

    return NextResponse.json({
      success: true,
      distanceKm,
      estimatedPrice: Math.round(price),
      pricePerKm,
      tripType: body.tripType,
      tripLabel: TRIP_LABELS[body.tripType],
    });
  } catch (error: unknown) {
    console.error("Booking error", error);
    return NextResponse.json(
      { error: "Unable to process booking. Pick locations from the suggestions." },
      { status: 500 },
    );
  }
}
