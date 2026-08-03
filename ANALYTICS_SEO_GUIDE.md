# Analytics & SEO Setup Guide

## 1. Where to paste your tracking IDs (the ONLY file you need to touch)

```
client/src/config/tracking.js
```

Open that file and either:
- **Fill in `client/.env`** (recommended) with these keys — see `client/.env.example`:
  ```
  VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
  VITE_GOOGLE_ADS_ID=AW-XXXXXXXXXX
  VITE_META_PIXEL_ID=1234567890123456
  VITE_GOOGLE_ADS_LABEL_LEAD=AbC-D1234efGH
  VITE_GOOGLE_ADS_LABEL_ADMISSION=AbC-D5678ijKL
  VITE_GOOGLE_ADS_LABEL_CALL=AbC-D9012mnOP
  VITE_GOOGLE_ADS_LABEL_WHATSAPP=AbC-D3456qrST
  VITE_GOOGLE_ADS_LABEL_BROCHURE=AbC-D7890uvWX
  ```
- **Or** hardcode the fallback values directly inside `tracking.js` if you'd rather not use `.env`.

Full instructions on where to find each ID (Google Analytics, Google Ads, and Meta Events Manager) are written as comments directly inside `client/src/config/tracking.js`.

**Nothing else needs editing.** Leave any value blank and that specific tag/event simply stays off — nothing breaks. Once you rebuild (`npm run build`) and redeploy, the tags activate automatically.

If you add a new phone number to the site later, also add it to `PHONE_NUMBERS` in `tracking.js` so click-tracking reports show which number it was, instead of "Unknown".

## 2. What gets tracked automatically once configured

| Event | Fires when | Fires to |
|---|---|---|
| `page_view` | Every page/route the visitor navigates to (SPA-aware) | GA4 + Meta |
| `form_start` | First interaction with the Enquiry form or Admissions form (once per session, not every keystroke) | GA4 |
| `generate_lead` / `admission_submitted` + Ads conversion + Meta `Lead` | Enquiry form or Admissions form submitted successfully | GA4 + Ads + Meta |
| `generate_lead` + Meta `Lead` | WhatsApp admission-enquiry modal submitted | GA4 + Meta |
| `click_to_call` + Ads conversion + Meta `Contact` | Any phone number clicked anywhere on the site (top bar, footer — all 4 numbers, floating button, every course/college page's call link) | GA4 + Ads + Meta |
| `whatsapp_click` + Ads conversion + Meta `Contact` | Floating WhatsApp button clicked | GA4 + Ads + Meta |
| `youtube_click` + Meta `ViewContent` | YouTube channel link clicked (footer or floating widget) | GA4 + Meta |
| `file_download` + Ads conversion + Meta `ViewContent` | Brochure PDF downloaded (Admissions page or Contact page) | GA4 + Ads + Meta |

Every phone-number and WhatsApp event includes *which* number was clicked (using the friendly labels from `PHONE_NUMBERS`/`WHATSAPP_NUMBERS` in `tracking.js`) and *where on the site* it was clicked (top bar, footer, a specific course page, etc) — so your reports can break down calls by number and by page, not just a single lumped "call" total.

## 3. Adding more tracked events yourself

Anywhere in a React component:
```jsx
import { trackEvent } from '../utils/analytics';

<button onClick={() => trackEvent('my_event_name', { any: 'extra data' })}>
```
That's it — it shows up in GA4 under Reports → Engagement → Events. It's a safe no-op if analytics isn't configured, so you can sprinkle these in freely without risk.

For a Meta Pixel event specifically:
```jsx
import { trackMetaEvent } from '../utils/analytics';
trackMetaEvent('Lead', { content_name: 'my_form' }); // use a Meta standard event name when one fits
```

For a Google Ads conversion:
```jsx
import { trackConversion } from '../utils/analytics';
trackConversion('lead'); // 'lead' must match a key in GOOGLE_ADS_LABELS in tracking.js
```

## 4. Verifying it's working

1. Set your real IDs in `client/.env`, then `npm run build`.
2. **Google**: open the live site, DevTools → Network tab, filter for `collect` or `gtag` — requests to `google-analytics.com`/`googletagmanager.com` should fire as you navigate and interact. In Google Analytics → Admin → DebugView (or the "Google Analytics Debugger" Chrome extension) you'll see events land in real time.
3. **Meta**: install the free "Meta Pixel Helper" Chrome extension — it shows exactly which Pixel events fired on the current page, and flags any errors.
4. **Google Ads**: conversions typically take a few hours to first show as "recording" after the first real one fires.

## 6. SEO, AEO & GEO — full pass across every page

**What these mean, briefly:**
- **SEO** (Search Engine Optimization) — being findable and ranking well in traditional Google/Bing search results.
- **AEO** (Answer Engine Optimization) — being the source Google pulls into featured snippets, "People Also Ask" boxes, and voice search answers.
- **GEO** (Generative Engine Optimization) — being readable, citable, and accurately summarizable by AI answer engines like ChatGPT, Perplexity, and Google's AI Overviews.

All three lean on the same foundation: clean structured data (schema.org), clear factual content, and explicitly welcoming the right crawlers. Here's everything done in this pass:

**Corrected an existing bug first**: the site's Organization structured data (in `index.html`) had social media URLs that didn't match the real links in your footer (wrong Instagram/Facebook handles, a placeholder YouTube URL, and X/Twitter missing entirely). Fixed to match exactly what's actually linked on the site — inconsistent data like this actively hurts AI/search trust signals.

**Organization + LocalBusiness schema, rebuilt with real data** (in `client/index.html`, appears on every page since this is the SPA shell):
- Full verified address (6-141, Shobana Nagar, Habsiguda, Hyderabad, Telangana 500007) with GPS coordinates
- All 4 real phone numbers, each as a proper `contactPoint`
- `areaServed` listing the neighborhoods you actually have campuses in (Habsiguda, KPHB, Dilsukhnagar, Gaddiannaram, Miyapur) — pulled from the real map locations already on your Contact page
- Corrected social profile links
- Full course catalog with links

*(Note: I used only verifiable data here — for the branch locations beyond Habsiguda, I only had area names and approximate coordinates from your Google Maps embeds, not confirmed complete street addresses, so I listed them as areas served rather than inventing precise addresses I couldn't verify. If you want each branch listed as its own separate structured location with full address, send me the complete address for each and I'll add them properly.)*

**Course + BreadcrumbList structured data** added to all 7 program pages (IIT-JEE, NEET, EAMCET, BITSAT, MPC-IIT, BiPC-NEET, MPC-EAMCET) — each now tells search/AI engines exactly what the program is, who provides it, and where it sits in your site structure.

**BreadcrumbList structured data** also added to About, Admissions, Contact, Blog, Gallery, and all 3 "Top Institutes" landing pages.

**AI crawler access — made explicit** in `robots.txt`: GPTBot (ChatGPT), PerplexityBot, Google-Extended (Gemini/AI Overviews), ClaudeBot, Applebot-Extended, and CCBot are now explicitly welcomed. This was already implicitly allowed before, but being explicit is the current best practice and protects against someone later adding a blanket bot-block without realizing it'd also cut off AI answer engines.

**`llms.txt` added** (`client/public/llms.txt`) — this is an emerging standard, essentially a "robots.txt for AI," that gives AI agents a clean, structured, markdown summary of who you are, what you offer, and your key pages, without needing to parse your full HTML. Built entirely from verified facts already on your site — no invented claims.

**Search Console / Bing verification, prepared and ready** — same pattern as your other tags. When you get your verification code from Google Search Console or Bing Webmaster Tools (Settings → Ownership verification → "HTML tag" method — just copy the `content` value), paste it into `client/.env`:
```
VITE_GOOGLE_SITE_VERIFICATION=your-code-here
VITE_BING_SITE_VERIFICATION=your-code-here
```
Rebuild and it verifies automatically — no separate file upload needed.

### What "later, give me the tag IDs" now covers, end to end
Once you have your accounts set up, everything below drops into `client/.env` and activates on the next build — nothing else to touch:
```
VITE_GA_MEASUREMENT_ID=          # Google Analytics 4
VITE_GOOGLE_ADS_ID=               # Google Ads
VITE_GOOGLE_ADS_LABEL_LEAD=
VITE_GOOGLE_ADS_LABEL_ADMISSION=
VITE_GOOGLE_ADS_LABEL_CALL=
VITE_GOOGLE_ADS_LABEL_WHATSAPP=
VITE_GOOGLE_ADS_LABEL_BROCHURE=
VITE_META_PIXEL_ID=               # Meta (Facebook/Instagram) Ads
VITE_GOOGLE_SITE_VERIFICATION=    # Google Search Console
VITE_BING_SITE_VERIFICATION=      # Bing Webmaster Tools
```

---

## 7. SEO improvements made in the previous pass (for reference)

- **`robots.txt`** and **`sitemap.xml`** added (client/public) — previously missing entirely.
- **Admin pages excluded from indexing**: added `<meta name="robots" content="noindex, nofollow">` to the Login and Dashboard pages, and `Disallow: /admin/` in `robots.txt` — admin pages should never appear in Google search results.
- **FAQPage structured data** added to the homepage (`Home.jsx`) — all 14 FAQ items are now marked up with schema.org `FAQPage`/`Question`/`Answer`, making them eligible for FAQ rich snippets directly in Google search results.
- **Article structured data + full social/canonical tags** added to blog post pages (`BlogPostView.jsx`) — previously had only a `<title>` and description; now has canonical URL, Open Graph, Twitter Card, and `Article` JSON-LD for each post.
- **Fixed 3 broken internal links** that pointed to non-existent static `.html` files instead of the actual React routes (IIT-JEE course card on the homepage, and two "Back to Blog" links) — these would have 404'd and hurt both user experience and crawlability.
- **Fixed 10 mismatched image `alt` attributes** on the About page — every feature card image had the same generic `alt="Expert Faculty"` regardless of what it actually showed; each now has accurate, descriptive alt text (helps both accessibility and image search SEO).
- **Video Gallery page**: added missing canonical URL for consistency with the rest of the site.
- **Dynamic sitemap** — `sitemap.xml` is now generated live by the backend (`server/routes/sitemapRoute.js`) instead of being a static file. It automatically includes every blog post from the database (using each post's `slug` and `createdAt` as `lastmod`), so new posts appear in the sitemap with no manual work. If MongoDB isn't reachable when the sitemap is requested, it falls back instantly to just the static pages rather than failing or hanging. Note: this dynamic version only works when the backend serves the frontend together (the default/recommended Hostinger setup in `DEPLOYMENT.md`) — if you split-deploy the frontend as a separate static site, it'll fall back to the static `client/public/sitemap.xml` file instead, which still covers all the fixed pages, just not individual blog posts.
- Every public page already had title/description/canonical/Open Graph tags — verified across all 22 routes.
- **All lead forms now collect optional Email and Location** — Enquiry form (used across every page it appears on) and the Admissions page form both have two new optional fields at the end. These are saved to the database and included in the notification email, and now show as columns in the Admin Dashboard tables (with quick `mailto:` links).

### Recommended next steps (not yet done — flagging honestly rather than guessing)
- **Image compression**: several images in `client/public/assets/public` are large JPG/PNG files served at `loading="eager"`. Converting the below-the-fold ones to `loading="lazy"` and compressing/serving next-gen formats (WebP) would meaningfully improve Google PageSpeed/Core Web Vitals scores — this touches a lot of files, so I've left it for a dedicated pass rather than rushing it.
- **JS bundle size**: the production build is currently ~870KB (one single JS file). Code-splitting by route (`React.lazy`) would reduce initial load time and help Core Web Vitals — also a dedicated-pass item given how many pages it touches.
