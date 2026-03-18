"use client";

import { useState } from "react";
import Image from "next/image";

type TripType = "one_way" | "round_trip";

interface BookingResponse {
  success?: boolean;
  distanceKm?: number;
  estimatedPrice?: number;
  pricePerKm?: number;
  error?: string;
}

export default function Home() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [tripType, setTripType] = useState<TripType>("one_way");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BookingResponse | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setResult(null);

    if (!name || !phone || !pickup || !drop || !travelDate) {
      setFormError("Please fill all the fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          pickup,
          drop,
          travelDate,
          tripType,
        }),
      });

      const data = (await res.json()) as BookingResponse;
      if (!res.ok) {
        setResult({ error: data.error || "Something went wrong." });
      } else {
        setResult(data);
      }
    } catch (error) {
      setResult({ error: "Unable to reach server. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-amber-400/60 bg-slate-900">
              <Image
                src="https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Akash DropTaxi Tech"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-amber-300/90">
                Akash DropTaxi Tech
              </p>
              <p className="text-sm font-medium text-slate-100">
                Premium One Way & Round Trip Cabs
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-6 text-xs font-medium text-slate-200/80 sm:flex">
            <span>TN · AP · KA · KL</span>
            <span className="inline-flex items-center rounded-full border border-emerald-400/50 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
              Transparent distance-based billing
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:px-8 lg:py-16">
        <section className="flex-1 space-y-8">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full border border-amber-400/60 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
              Luxury Intercity Taxi · Tamil Nadu
            </span>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Chennai to Coimbatore, Bangalore to Salem, Madurai to{" "}
              <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-rose-200 bg-clip-text text-transparent">
                anywhere in South India.
              </span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-200/80 sm:text-base">
              Premium one-way and two-way pickups across{" "}
              <span className="font-semibold text-amber-200">
                Tamil Nadu, Andhra Pradesh, Karnataka &amp; Kerala
              </span>
              . Clean AC sedans &amp; SUVs, professional drivers and 24×7 support with
              clear, distance-based pricing.
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs sm:text-sm">
              <a
                href="tel:+919443611501"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2 font-semibold text-slate-900 shadow-lg shadow-emerald-500/40 transition hover:brightness-110"
              >
                <span>Call now</span>
                <span className="text-xs font-medium">+91 94436 11501</span>
              </a>
              <a
                href="https://wa.me/919443611501"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/60 bg-emerald-500/10 px-4 py-2 font-medium text-emerald-200 transition hover:bg-emerald-500/20"
              >
                WhatsApp booking
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900 to-slate-950">
              <Image
                src="https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Chennai Marina Beach"
                width={400}
                height={260}
                className="h-40 w-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 px-3 pb-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
                  East Coast Road
                </p>
                <p className="text-sm font-medium text-slate-100">
                  Chennai · Pondicherry · Mahabalipuram
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900 to-slate-950">
              <Image
                src="https://images.pexels.com/photos/2101187/pexels-photo-2101187.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Ooty & Kodaikanal hills"
                width={400}
                height={260}
                className="h-40 w-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 px-3 pb-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                  Hill Stations
                </p>
                <p className="text-sm font-medium text-slate-100">
                  Ooty · Kodaikanal · Munnar · Yercaud
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900 to-slate-950">
              <Image
                src="https://images.pexels.com/photos/1796723/pexels-photo-1796723.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Temple towns in Tamil Nadu"
                width={400}
                height={260}
                className="h-40 w-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 px-3 pb-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                  Temple Circuits
                </p>
                <p className="text-sm font-medium text-slate-100">
                  Madurai · Rameswaram · Thanjavur · Kanchipuram
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 text-xs text-slate-200/80 sm:grid-cols-3 sm:text-sm">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
              <p className="font-semibold text-emerald-200">One Way &amp; Round Trip</p>
              <p>Perfect for city drops, airport runs &amp; multi-day tours.</p>
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
              <p className="font-semibold text-amber-200">Clean AC Sedans &amp; SUVs</p>
              <p>Spacious, well-maintained cars with professional chauffeurs.</p>
            </div>
            <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3">
              <p className="font-semibold text-sky-200">Across South India</p>
              <p>Tamil Nadu · Andhra · Karnataka · Kerala routes covered.</p>
            </div>
          </div>
        </section>

        <section className="flex-1">
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-black/60 backdrop-blur sm:p-6">
            <h2 className="text-lg font-semibold text-white sm:text-xl">
              Book your pickup &amp; drop
            </h2>
            <p className="mt-1 text-xs text-slate-300 sm:text-sm">
              Live distance-based estimate using Google Maps. Driver details will be shared
              after confirmation.
            </p>
            <p className="mt-3 inline-flex items-center rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-100">
              Live estimate · One Way · Round Trip · 24×7 Service
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none ring-amber-400/0 transition focus:ring-2 focus:ring-amber-400/80"
                    placeholder="Akash"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Mobile number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none ring-amber-400/0 transition focus:ring-2 focus:ring-amber-400/80"
                    placeholder="+91 9XXXXXXXXX"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">
                  Pickup location
                </label>
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none ring-amber-400/0 transition focus:ring-2 focus:ring-amber-400/80"
                  placeholder="Eg. Chennai Airport, T Nagar, Coimbatore RS"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">
                  Drop location
                </label>
                <input
                  type="text"
                  value={drop}
                  onChange={(e) => setDrop(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none ring-amber-400/0 transition focus:ring-2 focus:ring-amber-400/80"
                  placeholder="Eg. Madurai Meenakshi Temple, Whitefield Bangalore"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Date of travel
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none ring-amber-400/0 transition focus:ring-2 focus:ring-amber-400/80"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300">
                    Trip type
                  </label>
                  <div className="mt-1 flex gap-2 rounded-xl bg-slate-900/80 p-1">
                    <button
                      type="button"
                      onClick={() => setTripType("one_way")}
                      className={`flex-1 rounded-lg px-3 py-2 text-[11px] font-semibold transition ${
                        tripType === "one_way"
                          ? "bg-amber-400 text-slate-900"
                          : "text-slate-300 hover:bg-slate-800/80"
                      }`}
                    >
                      One Way
                    </button>
                    <button
                      type="button"
                      onClick={() => setTripType("round_trip")}
                      className={`flex-1 rounded-lg px-3 py-2 text-[11px] font-semibold transition ${
                        tripType === "round_trip"
                          ? "bg-amber-400 text-slate-900"
                          : "text-slate-300 hover:bg-slate-800/80"
                      }`}
                    >
                      Two Way / Round Trip
                    </button>
                  </div>
                </div>
              </div>

              {formError && (
                <p className="text-xs font-medium text-rose-300">{formError}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-rose-300 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-amber-500/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Calculating fare..." : "Get estimate & book now"}
              </button>
              <div className="mt-3 flex flex-wrap justify-center gap-3 text-[11px] text-slate-200 sm:justify-between sm:text-xs">
                <a
                  href="tel:+919443611501"
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-400/60 bg-emerald-500/10 px-3 py-1 font-medium text-emerald-100 hover:bg-emerald-500/20"
                >
                  Call booking: +91 94436 11501
                </a>
                <a
                  href="https://wa.me/919443611501"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-400/60 bg-emerald-500/10 px-3 py-1 font-medium text-emerald-100 hover:bg-emerald-500/20"
                >
                  WhatsApp: Chat & confirm instantly
                </a>
              </div>
            </form>

            {result && (
              <div className="mt-5 space-y-2 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-xs text-emerald-50 sm:text-sm">
                {result.error && (
                  <p className="font-medium text-rose-200">{result.error}</p>
                )}
                {result.success && (
                  <>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                      Approximate Fare
                    </p>
                    <p className="text-2xl font-semibold text-emerald-100">
                      ₹{result.estimatedPrice?.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-emerald-100">
                      Distance:{" "}
                      <span className="font-semibold">
                        {result.distanceKm?.toFixed(1)} km
                      </span>{" "}
                      {tripType === "round_trip" && (
                        <span className="font-medium text-emerald-200">
                          · Round trip (billed both ways)
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-emerald-200/90">
                      Our team will call you shortly to confirm car type, exact pickup
                      timing and driver details. Final fare may vary slightly based on
                      route, waiting time and tolls.
                    </p>
                  </>
                )}
              </div>
            )}

            <p className="mt-4 text-[10px] leading-relaxed text-slate-400">
              *Displayed fare is an approximate estimate for standard sedan trips within
              Tamil Nadu. Actual pricing can vary based on vehicle category, night
              charges, state taxes, tolls, waiting time and seasonal demand for routes in
              Tamil Nadu, Andhra Pradesh, Karnataka and Kerala.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black/60 py-4 text-center text-[11px] text-slate-400">
        <span className="font-medium text-slate-200">
          Akash DropTaxi Tech · Tamil Nadu Intercity Cabs
        </span>{" "}
        · One Way &amp; Two Way | TN · AP · KA · KL
      </footer>
    </div>
  );
}

