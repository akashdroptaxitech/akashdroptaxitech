export interface PlaceSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

function getApiKey() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_MAPS_API_KEY");
  }
  return apiKey;
}

export async function searchPlaces(query: string): Promise<PlaceSuggestion[]> {
  const apiKey = getApiKey();

  const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
    },
    body: JSON.stringify({
      input: query,
      includedRegionCodes: ["in"],
      languageCode: "en",
    }),
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error("Unable to search locations");
  }

  const data = await res.json();

  return (data.suggestions ?? [])
    .map((item: {
      placePrediction?: {
        placeId?: string;
        text?: { text?: string };
        structuredFormat?: {
          mainText?: { text?: string };
          secondaryText?: { text?: string };
        };
      };
    }) => {
      const prediction = item.placePrediction;
      if (!prediction?.placeId) return null;

      const mainText = prediction.structuredFormat?.mainText?.text ?? "";
      const secondaryText = prediction.structuredFormat?.secondaryText?.text ?? "";
      const description =
        prediction.text?.text ?? [mainText, secondaryText].filter(Boolean).join(", ");

      return {
        placeId: prediction.placeId,
        description,
        mainText,
        secondaryText,
      };
    })
    .filter(Boolean) as PlaceSuggestion[];
}

export async function getDistanceInKm(origin: string, destination: string): Promise<number> {
  const apiKey = getApiKey();

  const params = new URLSearchParams({
    origins: origin,
    destinations: destination,
    key: apiKey,
  });

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?${params.toString()}`,
    { next: { revalidate: 0 } },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch distance from Google Maps");
  }

  const data = await res.json();

  const element =
    data.rows?.[0]?.elements?.[0] && data.rows[0].elements[0].status === "OK"
      ? data.rows[0].elements[0]
      : null;

  if (!element?.distance) {
    throw new Error("Could not calculate distance for given locations");
  }

  const meters = element.distance.value as number;
  return meters / 1000;
}
