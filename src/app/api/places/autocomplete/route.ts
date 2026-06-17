import { NextRequest, NextResponse } from "next/server";
import { searchPlaces as searchGooglePlaces } from "@/lib/google-maps";
import { searchPlaces as searchOsmPlaces } from "@/lib/osm";

function getMapProvider() {
  return process.env.MAP_PROVIDER === "google" ? "google" : "openstreet";
}

export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get("input")?.trim() ?? "";

  if (input.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const provider = getMapProvider();

  if (provider === "google" && !process.env.GOOGLE_MAPS_API_KEY) {
    return NextResponse.json(
      { error: "Add GOOGLE_MAPS_API_KEY to .env.local" },
      { status: 503 },
    );
  }

  try {
    const searchPlaces = provider === "google" ? searchGooglePlaces : searchOsmPlaces;
    const suggestions = await searchPlaces(input);
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Places autocomplete error", error);
    return NextResponse.json(
      { error: "Unable to search locations." },
      { status: 500 },
    );
  }
}
