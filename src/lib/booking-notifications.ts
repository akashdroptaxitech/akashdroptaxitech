import type { TripType } from "@/lib/pricing";

const RESEND_API_KEY = "re_9dHefxgW_23tMLF1rssKRQE7Sj8y2LRnh";
// Resend testing mode only delivers to verified account emails.
// After verifying 3roses.tech on resend.com/domains, you can use any address on that domain.
const BOOKING_EMAIL_TO = "akashtravelstn23@gmail.com";
const RESEND_FROM_EMAIL = "Akash Drop Taxi <onboarding@resend.dev>";

const TRIP_LABELS: Record<TripType, string> = {
  one_way: "One Way",
  round_trip: "Round Trip",
};

export interface BookingDetails {
  name: string;
  phone: string;
  pickup: string;
  drop: string;
  travelDate: string;
  tripType: TripType;
  pickupTime?: string;
  vehicle?: string;
}

export function formatBookingMessage(
  body: BookingDetails,
  distanceKm: number,
  price: number,
) {
  return [
    "New Taxi Booking",
    "",
    `Name: ${body.name}`,
    `Phone: ${body.phone}`,
    `Trip type: ${TRIP_LABELS[body.tripType]}`,
    `Pickup: ${body.pickup}`,
    `Drop: ${body.drop}`,
    `Travel Date: ${body.travelDate}`,
    ...(body.pickupTime ? [`Pickup Time: ${body.pickupTime}`] : []),
    ...(body.vehicle ? [`Vehicle: ${body.vehicle}`] : []),
    "",
    `Distance: ${distanceKm.toFixed(1)} km`,
    `Estimated Fare: ₹${Math.round(price).toLocaleString("en-IN")}`,
  ].join("\n");
}

export async function notifyTelegram(
  body: BookingDetails,
  distanceKm: number,
  price: number,
) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text = `🚖 ${formatBookingMessage(body, distanceKm, price)}`;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

export async function notifyEmail(
  body: BookingDetails,
  distanceKm: number,
  price: number,
) {
  const apiKey = RESEND_API_KEY;
  const to = BOOKING_EMAIL_TO;
  if (!apiKey || !to) return;

  const from = RESEND_FROM_EMAIL;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `New Booking: ${body.pickup} → ${body.drop}`,
      text: formatBookingMessage(body, distanceKm, price),
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Email failed: ${error}`);
  }
}
