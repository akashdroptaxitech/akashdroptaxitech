export type TripType = "one_way" | "round_trip";

export const VEHICLE_RATES: Record<string, { oneWay: number; roundTrip: number }> = {
  sedan: { oneWay: 15, roundTrip: 14 },
  suv: { oneWay: 20, roundTrip: 19 },
  innova: { oneWay: 21, roundTrip: 20 },
  "innova-crysta": { oneWay: 24, roundTrip: 22 },
};

export function getPricePerKm(tripType: TripType, vehicleId: string): number {
  const rates = VEHICLE_RATES[vehicleId] ?? VEHICLE_RATES.sedan;
  return tripType === "round_trip" ? rates.roundTrip : rates.oneWay;
}

export function calculateFare(
  distanceKm: number,
  tripType: TripType,
  vehicleId: string,
): number {
  const rate = getPricePerKm(tripType, vehicleId);
  const multiplier = tripType === "round_trip" ? 2 : 1;
  return Math.round(distanceKm * rate * multiplier);
}
