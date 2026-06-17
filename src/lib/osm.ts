import type { PlaceSuggestion } from "@/lib/google-maps";

interface Coordinates {
  lat: number;
  lng: number;
}

const USER_AGENT = "AkashDropTaxi/1.0 (contact: +919443611501)";
const SEARCH_BBOX = "68.1,6.5,97.4,35.5";

function normalizeText(parts: Array<string | undefined>) {
  return [...new Set(parts.filter(Boolean))].join(", ");
}

function featureToSuggestion(feature: {
  geometry?: { coordinates?: [number, number] };
  properties?: Record<string, string | undefined>;
}): PlaceSuggestion | null {
  const coords = feature.geometry?.coordinates;
  const props = feature.properties;
  if (!coords || !props) return null;

  const [lng, lat] = coords;
  const mainText = props.name || props.city || props.street || "Selected location";
  const secondaryText = normalizeText([props.city, props.state, props.country]);
  const description = normalizeText([props.name, props.street, props.city, props.state, props.country]);

  return {
    placeId: `${lat.toFixed(5)},${lng.toFixed(5)}`,
    description: description || mainText,
    mainText,
    secondaryText,
  };
}

async function geocodeAddress(query: string): Promise<Coordinates> {
  const params = new URLSearchParams({
    q: query,
    limit: "1",
    lang: "en",
    bbox: SEARCH_BBOX,
  });

  const res = await fetch(`https://photon.komoot.io/api/?${params.toString()}`, {
    headers: { "User-Agent": USER_AGENT },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error("Unable to geocode location");

  const data = await res.json();
  const coords = data.features?.[0]?.geometry?.coordinates as [number, number] | undefined;
  if (!coords) throw new Error("Location not found");

  const [lng, lat] = coords;
  return { lat, lng };
}

export async function searchPlaces(query: string): Promise<PlaceSuggestion[]> {
  const params = new URLSearchParams({
    q: query,
    limit: "6",
    lang: "en",
    bbox: SEARCH_BBOX,
  });

  const res = await fetch(`https://photon.komoot.io/api/?${params.toString()}`, {
    headers: { "User-Agent": USER_AGENT },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error("Unable to search locations");

  const data = await res.json();
  return (data.features ?? [])
    .map((feature: Parameters<typeof featureToSuggestion>[0]) => featureToSuggestion(feature))
    .filter(Boolean) as PlaceSuggestion[];
}

export async function getDistanceInKm(origin: string, destination: string): Promise<number> {
  const from = await geocodeAddress(origin);
  const to = await geocodeAddress(destination);

  const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=false`;
  const res = await fetch(osrmUrl, {
    headers: { "User-Agent": USER_AGENT },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error("Failed to fetch route distance");

  const data = await res.json();
  const meters = data.routes?.[0]?.distance as number | undefined;
  if (data.code !== "Ok" || !meters) throw new Error("Could not calculate route distance");

  return meters / 1000;
}
