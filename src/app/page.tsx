"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LocationAutocomplete } from "@/components/LocationAutocomplete";

type TripType = "one_way" | "round_trip";

const PHONE = "+919443611501";
const PHONE_DISPLAY = "+91 94436 11501";

const TRIP_LABELS: Record<TripType, string> = {
  one_way: "One Way",
  round_trip: "Round Trip",
};

const PICKUP_TIMES = [
  "06:00 AM", "06:30 AM", "07:00 AM", "07:30 AM", "08:00 AM", "08:30 AM",
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM",
  "09:00 PM", "09:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM",
];

const VEHICLES = [
  {
    id: "sedan",
    name: "Sedan",
    seats: 4,
    bags: "2-3 Bags",
    image: "/fleet/swift-dzire.png",
    oneWay: 15,
    roundTrip: 14,
    hill: "₹500",
    waiting: "₹150/hr",
    allowance: "₹400",
  },
  {
    id: "suv",
    name: "SUV",
    seats: 6,
    bags: "4-5 Bags",
    image: "/fleet/ertiga.png",
    oneWay: 20,
    roundTrip: 19,
    hill: "₹700",
    waiting: "₹170/hr",
    allowance: "₹400",
  },
  {
    id: "innova",
    name: "Innova",
    seats: 7,
    bags: "5-6 Bags",
    image: "/fleet/innova.png",
    oneWay: 21,
    roundTrip: 20,
    hill: "Extra",
    waiting: "Extra",
    allowance: "Extra",
  },
  {
    id: "innova-crysta",
    name: "Innova Crysta",
    seats: 8,
    bags: "5-6 Bags",
    image: "/fleet/innova-crysta.png",
    oneWay: 24,
    roundTrip: 22,
    hill: "Extra",
    waiting: "Extra",
    allowance: "Extra",
  },
];

const SERVICES = [
  {
    title: "One Way Taxi",
    desc: "Affordable one way drop taxi service across Tamil Nadu and Karnataka with transparent pricing.",
    icon: "→",
  },
  {
    title: "Round Trip Taxi",
    desc: "Book a flexible round trip taxi with return options and competitive travel packages.",
    icon: "↔",
  },
  {
    title: "Airport Transfer",
    desc: "On-time pickup and drop service to major airports with professional drivers.",
    icon: "✈",
  },
  {
    title: "Outstation Taxi",
    desc: "Comfortable long distance taxi services covering 40+ major cities and towns.",
    icon: "🛣",
  },
];

const WHY_CHOOSE = [
  { title: "24/7 Service", desc: "Round the clock taxi service for your convenience", icon: "🕐" },
  { title: "Verified Drivers", desc: "All our drivers are background verified and experienced", icon: "✓" },
  { title: "Transparent Pricing", desc: "No hidden charges. Pay only what you see", icon: "₹" },
  { title: "41 Cities Coverage", desc: "Extensive network covering major cities in South India", icon: "📍" },
  { title: "Safe Travel", desc: "GPS tracked vehicles with live location sharing", icon: "🛡" },
];

const POPULAR_ROUTES = [
  {
    city: "Chennai",
    desc: "Major coastal city known for cultural heritage, Marina Beach, and growing IT corridors.",
    image: "https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    city: "Bangalore",
    desc: "India's leading tech hub with modern lifestyle, green spaces, and vibrant nightlife.",
    image: "https://images.pexels.com/photos/2101187/pexels-photo-2101187.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    city: "Tirupati",
    desc: "One of the most visited pilgrimage destinations, known for its sacred temple.",
    image: "https://images.pexels.com/photos/1796723/pexels-photo-1796723.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

const CITY_SERVICES = [
  { city: "Bengaluru", routes: ["Bangalore to Chennai", "Bangalore to Mysore", "Bangalore to Coimbatore", "Bangalore to Tirupati"] },
  { city: "Chennai", routes: ["Chennai to Bangalore", "Chennai to Pondicherry", "Chennai to Madurai", "Chennai to Tirupati"] },
  { city: "Thirupathi", routes: ["Tirupati to Chennai", "Tirupati to Bangalore", "Tirupati to Vellore", "Tirupati to Kadapa"] },
];

const TESTIMONIALS = [
  { name: "Rajesh Kumar", city: "Bangalore", text: "Smooth and hassle-free journey from Bangalore to Chennai. The driver was professional, punctual, and the vehicle was well-maintained." },
  { name: "Priya Sharma", city: "Chennai", text: "Booked a one-way ride to Madurai and the entire experience was seamless. Transparent pricing and excellent service quality." },
  { name: "Suresh Reddy", city: "Bangalore", text: "Airport pickup was right on time and very well coordinated. The driver was courteous and the ride was comfortable throughout." },
  { name: "Lakshmi Narayanan", city: "Coimbatore", text: "Travelled to Kanyakumari in an Innova — a very comfortable long-distance ride. Clean vehicle and smooth driving." },
  { name: "Arun Prakash", city: "Mysore", text: "Had a pleasant trip to Ooty. The driver was knowledgeable about routes and stops, making the journey more enjoyable." },
];

const FAQS = [
  { q: "How much does a one way taxi from Bangalore cost?", a: "Pricing depends on distance and vehicle type. Sedan starts at ₹15/km for one way. Use our booking form for an instant estimate based on your route." },
  { q: "Is the driver experienced for long distance travel?", a: "Yes. All our drivers are experienced in long-distance and outstation routes across South India, with thorough background verification." },
  { q: "Can I book a taxi for immediate pickup?", a: "Yes. We offer same-day and immediate pickup subject to vehicle availability. Call us at +91 94436 11501 for fastest confirmation." },
  { q: "What payment methods do you accept?", a: "We accept UPI, cash, and bank transfer. Payment can be made at the end of the trip or as agreed during booking confirmation." },
  { q: "Is there a cancellation policy?", a: "Free cancellation up to 2 hours before pickup. Cancellations within 2 hours may incur a nominal charge depending on the route and vehicle allocated." },
];

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Fleet", href: "#fleet" },
  { label: "Services", href: "#services" },
  { label: "Routes", href: "#routes" },
  { label: "FAQ", href: "#faq" },
];

interface BookingResponse {
  success?: boolean;
  distanceKm?: number;
  estimatedPrice?: number;
  pricePerKm?: number;
  error?: string;
}

interface FareEstimate {
  distanceKm: number;
  estimatedPrice: number;
  pricePerKm: number;
}

function IconPhone({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function IconWhatsApp({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.86L0 24l6.335-1.662A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82a9.82 9.82 0 01-5.012-1.374l-.36-.214-3.76.987 1.004-3.667-.235-.374A9.82 9.82 0 1112 21.82z" />
    </svg>
  );
}

const WA_LINK = `https://wa.me/${PHONE.replace("+", "")}`;

const WA_BTN_ICON =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[#070606] shadow-md shadow-amber-500/25 transition hover:from-amber-300 hover:to-amber-500 active:scale-95";

const WA_BTN_PILL =
  "inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-6 py-3 text-sm font-semibold text-amber-200 backdrop-blur-sm transition hover:border-amber-400 hover:bg-amber-500/20 hover:text-amber-100 active:scale-95";

const WA_BTN_FULL =
  "flex w-full items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-sm font-semibold text-[#070606] shadow-md shadow-amber-500/25 transition hover:from-amber-300 hover:to-amber-400 active:scale-[0.98]";

const WA_BTN_TEXT =
  "inline-flex items-center gap-2 text-amber-400/90 transition hover:text-amber-300";

function WhatsAppLink({
  variant = "icon",
  className = "",
  onClick,
}: {
  variant?: "icon" | "pill" | "full" | "text";
  className?: string;
  onClick?: () => void;
}) {
  const styles = {
    icon: WA_BTN_ICON,
    pill: WA_BTN_PILL,
    full: WA_BTN_FULL,
    text: WA_BTN_TEXT,
  };

  const iconSize = variant === "icon" ? "h-[18px] w-[18px]" : "h-4 w-4";
  const label = variant === "text" ? "WhatsApp Booking" : "WhatsApp";

  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noreferrer"
      onClick={onClick}
      className={`${styles[variant]} ${className}`}
      aria-label="WhatsApp us"
    >
      <IconWhatsApp className={iconSize} />
      {variant !== "icon" && label}
    </a>
  );
}

function BrandMark() {
  return (
    <a href="#home" className="group flex min-w-0 items-center gap-1 sm:gap-1.5">
      <Image
        src="/logo-car.png"
        alt=""
        width={788}
        height={310}
        priority
        className="h-11 w-auto shrink-0 object-contain brightness-110 contrast-125 transition group-hover:brightness-125 sm:h-12 md:h-14"
        aria-hidden
      />
      <span className="min-w-0 leading-none">
        <span className="font-brand block truncate bg-gradient-to-b from-amber-100 via-amber-400 to-amber-600 bg-clip-text text-base font-bold tracking-wide text-transparent sm:text-lg md:text-xl">
          AKASH
        </span>
        <span className="mt-0.5 flex items-center gap-1.5">
          <span className="hidden h-px w-2.5 bg-amber-600/60 sm:block" aria-hidden />
          <span className="truncate text-[9px] font-bold uppercase tracking-[0.2em] text-amber-500 sm:text-[10px]">
            Drop Taxi
          </span>
          <span className="hidden h-px w-2.5 bg-amber-600/60 sm:block" aria-hidden />
        </span>
      </span>
    </a>
  );
}

function HeaderActions({ onBook, className = "" }: { onBook: () => void; className?: string }) {
  const iconBtn =
    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition active:scale-95";
  const bookBtn =
    "inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 text-xs font-bold text-[#070606] shadow-md shadow-amber-500/30 transition hover:from-amber-300 hover:to-amber-400 active:scale-95 sm:px-4 sm:text-sm";

  return (
    <div className={`flex items-center gap-1.5 sm:gap-2 ${className}`}>
      <button type="button" onClick={onBook} className={bookBtn}>
        Book Now
      </button>
      <a
        href={`tel:${PHONE}`}
        className={`${iconBtn} bg-gradient-to-br from-amber-400 to-amber-600 text-[#070606] shadow-md shadow-amber-500/25 hover:from-amber-300 hover:to-amber-500`}
        aria-label="Call us"
      >
        <IconPhone className="h-[18px] w-[18px]" />
      </a>
      <WhatsAppLink variant="icon" />
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pickupPlaceId, setPickupPlaceId] = useState<string | null>(null);
  const [dropPlaceId, setDropPlaceId] = useState<string | null>(null);
  const [travelDate, setTravelDate] = useState("");
  const [pickupTime, setPickupTime] = useState("09:00 AM");
  const [vehicle, setVehicle] = useState("sedan");
  const [tripType, setTripType] = useState<TripType>("one_way");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BookingResponse | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<FareEstimate | null>(null);
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [estimateError, setEstimateError] = useState<string | null>(null);

  useEffect(() => {
    if (!pickupPlaceId || !dropPlaceId) {
      setEstimate(null);
      setEstimateError(null);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setEstimateLoading(true);
      setEstimateError(null);

      try {
        const params = new URLSearchParams({
          pickup: pickup.trim(),
          drop: drop.trim(),
          tripType,
          vehicle,
        });
        const res = await fetch(`/api/estimate?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = (await res.json()) as FareEstimate & { error?: string };

        if (!res.ok) {
          setEstimate(null);
          setEstimateError(data.error || "Could not calculate fare.");
          return;
        }

        setEstimate({
          distanceKm: data.distanceKm,
          estimatedPrice: data.estimatedPrice,
          pricePerKm: data.pricePerKm,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setEstimate(null);
          setEstimateError("Could not calculate fare.");
        }
      } finally {
        setEstimateLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [pickup, drop, pickupPlaceId, dropPlaceId, tripType, vehicle]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setResult(null);

    if (!name || !phone || !pickup || !drop || !travelDate) {
      setFormError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          pickup,
          drop,
          travelDate,
          tripType,
          pickupTime,
          vehicle,
        }),
      });

      const data = (await res.json()) as BookingResponse;
      if (!res.ok) {
        setResult({ error: data.error || "Something went wrong." });
      } else {
        setResult(data);
        document.getElementById("booking-result")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    } catch {
      setResult({ error: "Unable to reach server. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  function scrollToBook() {
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  }

  return (
    <div className="min-h-dvh bg-white text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-amber-900/25 bg-[#070606]/98 shadow-lg shadow-black/30 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-3 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-6 lg:px-8">
          <BrandMark />

          <nav className="hidden items-center justify-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-neutral-300 transition hover:bg-amber-500/10 hover:text-amber-400"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
            <HeaderActions onBook={scrollToBook} className="hidden lg:flex" />
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-800/50 text-amber-300 transition hover:border-amber-600 hover:bg-amber-500/10 lg:hidden"
              aria-label="Toggle menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-amber-900/25 bg-[#070606] px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-200 transition hover:bg-amber-500/10 hover:text-amber-400"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2.5 border-t border-amber-900/25 pt-4">
              <button
                type="button"
                onClick={scrollToBook}
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3 text-sm font-bold text-[#070606] shadow-md shadow-amber-500/25 transition hover:from-amber-300 hover:to-amber-400"
              >
                Book Now
              </button>
              <a
                href={`tel:${PHONE}`}
                onClick={() => setMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 py-3 text-sm font-semibold text-[#070606] transition hover:from-amber-300 hover:to-amber-500"
              >
                <IconPhone className="h-4 w-4" />
                Call {PHONE_DISPLAY}
              </a>
              <WhatsAppLink variant="full" onClick={() => setMenuOpen(false)} />
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="home" className="relative min-h-[520px] overflow-hidden sm:min-h-[580px] lg:min-h-[640px]">
        <Image
          src="/hero-banner.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="animate-fade-up space-y-6 text-white">
              <span className="inline-flex items-center rounded-full border border-amber-400/40 bg-amber-500/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-200">
                Drop Taxi Outstation Service
              </span>
              <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                One Way and Drop Taxi Services Across{" "}
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">South India</span>
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-neutral-300 sm:text-lg">
                Book reliable one way taxi and outstation cab services across Tamil Nadu,
                Andhra Pradesh, Karnataka &amp; Kerala. Affordable drop taxi with professional
                drivers, transparent pricing, and 24/7 availability.
              </p>

              <div className="max-w-lg rounded-2xl border border-amber-400/25 bg-black/30 px-4 py-4 backdrop-blur-sm sm:px-5 sm:py-5">
                <p className="text-sm leading-relaxed text-neutral-100 sm:text-base">
                  <span className="font-semibold text-amber-300">Your trip. Your vehicle.</span>{" "}
                  From sedans and SUVs to vans, tempo travellers, and Urbania — pick the perfect ride for solo travel, family trips, or group outings at the best outstation rates.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                {[
                  { label: "Safe & Secure", icon: "🛡" },
                  { label: "Best Price", icon: "₹" },
                  { label: "24/7 Support", icon: "📞" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm"
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={`tel:${PHONE}`}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-sm font-bold text-[#070606] shadow-lg shadow-amber-500/25 transition hover:from-amber-300 hover:to-amber-400"
                >
                  <IconPhone className="h-4 w-4" />
                  Call Now
                </a>
                <WhatsAppLink variant="pill" />
              </div>
            </div>

            {/* Booking Form */}
            <div id="book" className="animate-fade-up rounded-2xl bg-white p-5 shadow-2xl shadow-black/20 sm:p-6 lg:p-7" style={{ animationDelay: "0.15s" }}>
              <h2 className="text-xl font-bold text-slate-900">Book Your Ride</h2>
              <p className="mt-1 text-sm text-gray-500">
                Car, Van, Tempo Traveller &amp; Urbania — instant estimate for all vehicle types
              </p>

              <div className="mt-4 flex rounded-xl bg-gray-100 p-1">
                {(Object.keys(TRIP_LABELS) as TripType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTripType(type)}
                    className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                      tripType === type
                        ? "bg-gradient-to-r from-amber-400 to-amber-500 text-[#070606] shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {TRIP_LABELS[type]}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">Mobile</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      placeholder="+91 9XXXXXXXXX"
                      required
                    />
                  </div>
                </div>

                <LocationAutocomplete
                  label="Pickup Location"
                  value={pickup}
                  onChange={(value) => {
                    setPickup(value);
                    setPickupPlaceId(null);
                  }}
                  onSelect={(suggestion) => setPickupPlaceId(suggestion.placeId)}
                  placeholder="Eg. Chennai Airport, T Nagar"
                  required
                />

                <LocationAutocomplete
                  label="Drop Location"
                  value={drop}
                  onChange={(value) => {
                    setDrop(value);
                    setDropPlaceId(null);
                  }}
                  onSelect={(suggestion) => setDropPlaceId(suggestion.placeId)}
                  placeholder="Eg. Bangalore, Madurai"
                  required
                />

                {((pickup || drop) && (!pickupPlaceId || !dropPlaceId)) && (
                  <p className="text-xs text-gray-500">
                    Select pickup and drop from the suggestions to see distance and fare.
                  </p>
                )}

                {(estimateLoading || estimate || estimateError) && (
                  <div
                    className={`rounded-xl border px-4 py-3 text-sm ${
                      estimateError
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-amber-200 bg-amber-50 text-amber-950"
                    }`}
                  >
                    {estimateLoading && (
                      <p className="text-gray-600">Calculating distance and fare...</p>
                    )}
                    {!estimateLoading && estimateError && (
                      <p>{estimateError}</p>
                    )}
                    {!estimateLoading && estimate && (
                      <>
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                          Instant Fare Estimate
                        </p>
                        <p className="mt-1 text-2xl font-extrabold text-amber-700">
                          ₹{estimate.estimatedPrice.toLocaleString("en-IN")}
                        </p>
                        <p className="mt-1 text-gray-600">
                          Distance: <strong>{estimate.distanceKm.toFixed(1)} km</strong>
                          {" · "}
                          ₹{estimate.pricePerKm}/km
                          {tripType === "round_trip" && " · Round trip (both ways)"}
                        </p>
                        <p className="mt-1.5 text-xs text-gray-500">
                          Toll, permit and parking charges extra.
                        </p>
                      </>
                    )}
                  </div>
                )}

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">Travel Date</label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="date-input w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">Pickup Time</label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    >
                      {PICKUP_TIMES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Select Vehicle</label>
                  <select
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  >
                    {VEHICLES.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1.5 text-xs text-gray-500">
                    Van, Tempo Traveller &amp; Urbania also available — select nearest option or call us to confirm.
                  </p>
                </div>

                {formError && (
                  <p className="text-sm font-medium text-red-600">{formError}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 py-3.5 text-sm font-bold text-[#070606] shadow-lg shadow-amber-500/30 transition hover:from-amber-300 hover:to-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Calculating fare..." : "Book Now"}
                </button>
              </form>

              {result && (
                <div
                  id="booking-result"
                  className={`mt-4 rounded-xl border p-4 text-sm ${
                    result.error
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-amber-200 bg-amber-50 text-amber-950"
                  }`}
                >
                  {result.error && <p className="font-medium">{result.error}</p>}
                  {result.success && (
                    <>
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                        Booking Successful — Approximate Fare
                      </p>
                      <p className="mt-1 text-3xl font-extrabold text-amber-700">
                        ₹{result.estimatedPrice?.toLocaleString("en-IN")}
                      </p>
                      <p className="mt-1 text-gray-600">
                        Distance: <strong>{result.distanceKm?.toFixed(1)} km</strong>
                        {tripType === "round_trip" && " · Round Trip (billed both ways)"}
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        Our team will call you shortly to confirm vehicle, timing and driver details.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Fleet */}
      <section id="fleet" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-amber-600">Our Fleet</span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Choose Your Perfect Ride</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-500">
              From sedan and SUV to Van, Tempo Traveller and Urbania — comfortable rides for every group size and journey
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {VEHICLES.map((v) => (
              <div
                key={v.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(0,0,0,0.1)]"
              >
                <div className="relative h-[132px] w-full shrink-0 overflow-hidden bg-white sm:h-[148px]">
                  <Image
                    src={v.image}
                    alt={v.name}
                    fill
                    unoptimized
                    priority={v.id === "sedan"}
                    className="object-contain object-center p-2 transition duration-300 group-hover:scale-[1.02] sm:p-3"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="flex flex-1 flex-col px-4 pb-4 pt-2.5 sm:px-5 sm:pb-5 sm:pt-3">
                  <h3 className="text-base font-bold uppercase tracking-wide text-slate-900 sm:text-[17px]">
                    {v.name}
                  </h3>
                  <div className="mt-2 flex gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">👤 {v.seats} Seats</span>
                    <span className="flex items-center gap-1">🧳 {v.bags}</span>
                  </div>
                  <div className="mt-2.5 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-lg bg-[#fff9e6] px-2.5 py-2 sm:px-3">
                      <p className="text-[11px] text-gray-500">One Way</p>
                      <p className="text-sm font-bold text-amber-600">₹{v.oneWay}/km</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 px-2.5 py-2 sm:px-3">
                      <p className="text-[11px] text-gray-500">Round Trip</p>
                      <p className="text-sm font-bold text-slate-800">₹{v.roundTrip}/km</p>
                    </div>
                  </div>
                  <div className="mt-2.5 space-y-0.5 text-xs leading-relaxed text-gray-500">
                    <p>Hill Charges: {v.hill}</p>
                    <p>Waiting: {v.waiting}</p>
                    <p>Driver Allowance: {v.allowance}</p>
                  </div>
                  <p className="mt-2 text-[10px] leading-snug text-gray-400 sm:text-[11px]">
                    Note: Toll, Permit &amp; Parking Charges Extra · Bio Breaks Free
                  </p>
                  <div className="mt-auto flex gap-2 pt-3">
                    <a
                      href={`tel:${PHONE}`}
                      className="flex-1 rounded-lg border border-amber-500 py-2 text-center text-xs font-semibold text-amber-600 transition hover:bg-amber-50"
                    >
                      Call Us
                    </a>
                    <button
                      type="button"
                      onClick={scrollToBook}
                      className="flex-1 rounded-lg bg-amber-500 py-2 text-xs font-semibold text-white transition hover:bg-amber-400"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Our Services</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-500">
              Reliable taxi services designed for comfortable city rides, outstation trips,
              airport transfers, and flexible travel plans.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-amber-200 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-xl">
                  {s.icon}
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Why Choose Akash Drop Taxi</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-500">
              Trusted by thousands of travelers for safe and comfortable outstation rides
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {WHY_CHOOSE.map((item) => (
              <div key={item.title} className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl">
                  {item.icon}
                </div>
                <h3 className="mt-4 font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section id="routes" className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Popular Routes</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-500">
              One-way taxi services across South India with comfort and reliability
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {POPULAR_ROUTES.map((route) => (
              <div
                key={route.city}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={route.image}
                    alt={route.city}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1 text-xs font-semibold text-[#070606]">
                    One Way
                  </span>
                  <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">{route.city}</h3>
                </div>
                <p className="p-5 text-sm leading-relaxed text-gray-500">{route.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* City Services */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Our Service</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-500">
              Reliable one-way and round trip taxi services from major cities across South India
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {CITY_SERVICES.map((cs) => (
              <div key={cs.city} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <h3 className="text-lg font-bold text-amber-700">Taxi from {cs.city}</h3>
                <p className="mt-1 text-xs text-gray-400">Most popular routes</p>
                <ul className="mt-4 space-y-2">
                  {cs.routes.map((r) => (
                    <li key={r} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      {r}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={scrollToBook}
                  className="mt-5 text-sm font-semibold text-amber-600 transition hover:text-amber-700"
                >
                  View all routes from {cs.city} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="overflow-hidden bg-amber-50/60 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">What Our Customers Say</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-500">
              Trusted by thousands of happy travelers across South India
            </p>
          </div>
        </div>
        <div className="relative mt-12">
          <div className="flex w-max animate-marquee gap-6 px-4">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div
                key={`${t.name}-${i}`}
                className="w-80 shrink-0 rounded-2xl border border-amber-100 bg-white p-6 shadow-sm"
              >
                <p className="text-sm leading-relaxed text-gray-600">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-bold text-[#070606]">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Frequently Asked Questions</h2>
          </div>
          <div className="mt-10 space-y-3">
            {FAQS.map((faq, i) => (
              <div key={faq.q} className="overflow-hidden rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-900 transition hover:bg-gray-50"
                >
                  {faq.q}
                  <svg
                    className={`h-5 w-5 shrink-0 text-amber-600 transition ${openFaq === i ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="border-t border-gray-100 px-5 py-4 text-sm leading-relaxed text-gray-500">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-[#070606] to-neutral-900 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <div>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">Ready to Book Your Ride?</h2>
            <p className="mt-2 text-amber-100/80">Call now or book online for instant fare estimate</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 text-sm font-bold text-[#070606] shadow-lg shadow-amber-500/25 transition hover:from-amber-300 hover:to-amber-400"
            >
              <IconPhone className="h-4 w-4" />
              {PHONE_DISPLAY}
            </a>
            <button
              type="button"
              onClick={scrollToBook}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Book Online
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#070606] py-10 text-amber-100/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <Image
                src="/logo-car.png"
                alt="Akash Drop Taxi"
                width={788}
                height={310}
                className="h-14 w-auto object-contain brightness-110 contrast-125 sm:h-16"
              />
              <p className="font-brand mt-2 bg-gradient-to-b from-amber-100 via-amber-400 to-amber-600 bg-clip-text text-xl font-bold text-transparent">
                AKASH DROP TAXI
              </p>
              <p className="mt-1 text-xs italic text-neutral-500">One Way &amp; Round Trip Cabs</p>
              <p className="mt-3 text-sm leading-relaxed">
                Premium one-way and round-trip outstation taxi service across Tamil Nadu,
                Andhra Pradesh, Karnataka &amp; Kerala.
              </p>
            </div>
            <div>
              <p className="font-semibold text-white">Quick Links</p>
              <ul className="mt-3 space-y-2 text-sm">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="transition hover:text-white">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white">Contact</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a href={`tel:${PHONE}`} className="transition hover:text-white">{PHONE_DISPLAY}</a>
                </li>
                <li>
                  <WhatsAppLink variant="text" />
                </li>
                <li>TN · AP · KA · KL</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-amber-900/40 pt-6 text-center text-xs">
            © {new Date().getFullYear()} Akash Drop Taxi. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
