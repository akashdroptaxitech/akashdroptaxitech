## Akash DropTaxi Tech – Next.js App

Premium one-way and round-trip taxi booking for Tamil Nadu, Andhra Pradesh, Karnataka and Kerala, built with **Next.js (App Router)** and deployed on **Vercel**.

This app lets users:

- **View a luxury travel landing page** highlighting major routes and locations.
- **Book pickup & drop** with name, phone, pickup, drop, date and trip type (one-way / round-trip).
- **Get an approximate fare** based on Google Maps distance at **₹13/km** (round trips billed both ways).
- **Notify the driver on Telegram** with booking details when a user submits the form.

---

### Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Backend**: Next.js API route (`/api/book`)
- **Integrations**:
  - Google Maps Distance Matrix API – for distance calculation
  - Telegram Bot API – to send booking details to driver

---

### Getting Started (Local)

1. **Install dependencies**

```bash
cd akashdroptaxitech
npm install
```

2. **Create `.env.local`**

Copy the example file and fill in real values:

```bash
cp .env.example .env.local
```

Update it with:

- `MAP_PROVIDER` – `openstreet` (free default) or `google`.
- `GOOGLE_MAPS_API_KEY` – Distance Matrix API key (with billing enabled).
- Booking email settings are hardcoded in `src/lib/booking-notifications.ts`.
- `TELEGRAM_BOT_TOKEN` – bot token from BotFather.
- `TELEGRAM_CHAT_ID` – chat ID of the driver / group that should receive booking alerts.

### Map Provider Switch

You can switch map/search providers without code changes:

- `MAP_PROVIDER=openstreet` → Uses Photon + OSRM (free, no API key required).
- `MAP_PROVIDER=google` → Uses Places API (New) + Distance Matrix API (`GOOGLE_MAPS_API_KEY` required).

Recommended for free usage:

```env
MAP_PROVIDER=openstreet
```

### Free Booking Email Setup

1. Sign up at [resend.com](https://resend.com) (free: 3,000 emails/month).
2. Create an API key and paste it into `RESEND_API_KEY` in `src/lib/booking-notifications.ts`.
3. Booking alerts are sent to `abisheks@3roses.tech` from `onboarding@resend.dev`.

### Run the dev server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

### How Booking Works

1. User fills in **name, mobile**, **pickup**, **drop**, **travel date**, and selects **one-way** or **round trip**.
2. Frontend calls the backend **`POST /api/book`** API.
3. Backend uses **Google Maps Distance Matrix API** to calculate distance between pickup and drop locations.
4. Fare is estimated as:

   - One way: `distance_km × 13`
   - Round trip: `distance_km × 13 × 2`

5. Backend sends a **Telegram message** to the configured driver chat with:

   - User name & phone
   - Pickup & drop location
   - Date of travel
   - Trip type
   - Distance & estimated fare

6. User immediately sees the **approximate fare** on the website.

---

### Deploying to Vercel

1. **Push the project to GitHub / GitLab / Bitbucket** (optional but recommended).
2. Go to [Vercel dashboard](https://vercel.com) and click **“New Project”**.
3. Import the repository that contains this app (the `akashdroptaxitech` folder).
4. In the **project settings → Environment Variables**, add:

   - `GOOGLE_MAPS_API_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`

5. Click **Deploy**. Vercel will:

   - Install dependencies via `npm install`
   - Build with `npm run build`
   - Host the app at a production URL (`https://your-project-name.vercel.app`).

Whenever you push changes to the default branch, Vercel automatically redeploys.

---

### Customisation Tips

- **Branding**: Update logo, name, and text in `src/app/page.tsx`.
- **Images**: Replace the Pexels / stock URLs with your own car and location images.
- **Pricing**: Change `PRICE_PER_KM` in `src/app/api/book/route.ts` if your per-km rate changes.
- **Multiple drivers**: Set `TELEGRAM_CHAT_ID` to a Telegram group so multiple drivers receive booking alerts.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
