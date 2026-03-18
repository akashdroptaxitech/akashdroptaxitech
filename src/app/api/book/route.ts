import { NextRequest, NextResponse } from "next/server";

const PRICE_PER_KM = 13;

type TripType = "one_way" | "round_trip";

interface BookingRequestBody {
  name: string;
  phone: string;
  pickup: string;
  drop: string;
  travelDate: string;
  tripType: TripType;
}

async function getDistanceInKm(origin: string, destination: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_MAPS_API_KEY");
  }

  const params = new URLSearchParams({
    origins: origin,
    destinations: destination,
    key: apiKey,
  });

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?${params.toString()}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch distance from Google Maps");
  }

  const data = await res.json();

  const element =
    data.rows?.[0]?.elements?.[0] && data.rows[0].elements[0].status === "OK"
      ? data.rows[0].elements[0]
      : null;

  if (!element || !element.distance) {
    throw new Error("Could not calculate distance for given locations");
  }

  const meters = element.distance.value as number;
  return meters / 1000;
}

async function notifyDriver(body: BookingRequestBody, distanceKm: number, price: number) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    // Silently skip if not configured; app should still work.
    return;
  }

  const messageLines = [
    "🚖 New Taxi Booking",
    "",
    `Name: ${body.name}`,
    `Phone: ${body.phone}`,
    `Trip type: ${body.tripType === "one_way" ? "One Way" : "Two Way / Round Trip"}`,
    `Pickup: ${body.pickup}`,
    `Drop: ${body.drop}`,
    `Travel Date: ${body.travelDate}`,
    "",
    `Distance: ${distanceKm.toFixed(1)} km`,
    `Estimated Fare: ₹${Math.round(price).toLocaleString("en-IN")}`,
  ];

  const text = messageLines.join("\n");

  const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
  await fetch(telegramUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
    }),
  });
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

    const distanceKm = await getDistanceInKm(body.pickup, body.drop);

    const multiplier = body.tripType === "round_trip" ? 2 : 1;
    const price = distanceKm * PRICE_PER_KM * multiplier;

    await notifyDriver(body, distanceKm, price).catch(() => {
      // Ignore notification errors
    });

    return NextResponse.json({
      success: true,
      distanceKm,
      estimatedPrice: Math.round(price),
      pricePerKm: PRICE_PER_KM,
    });
  } catch (error: unknown) {
    console.error("Booking error", error);
    return NextResponse.json(
      { error: "Unable to process booking at the moment." },
      { status: 500 },
    );
  }
}

