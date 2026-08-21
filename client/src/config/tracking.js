/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  TRACKING CONFIG — paste your Google Analytics, Google Ads & Meta IDs below.
 *  This is the ONLY file you need to edit to turn on tracking.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * WHERE TO GET EACH VALUE:
 *
 * 1. GA4_MEASUREMENT_ID
 *    → Google Analytics (analytics.google.com) → Admin → Data Streams →
 *      select your web stream → "Measurement ID" (looks like "G-XXXXXXXXXX")
 *
 * 2. GOOGLE_ADS_ID
 *    → Google Ads (ads.google.com) → Tools & Settings → Conversions →
 *      "Google Ads Conversion ID" (looks like "AW-XXXXXXXXXX")
 *      (You'll also see this in "Tag Setup" as your "Conversion ID")
 *
 * 3. CONVERSION LABELS (one per action you want Google Ads to count as a
 *    conversion — enquiry submitted, admission submitted, a call, etc.)
 *    → Google Ads → Tools & Settings → Conversions → create/click a
 *      conversion action → "Tag setup" → "Use Google tag" → copy the part
 *      after the slash in `send_to: 'AW-XXXXXXXXXX/AbC-D1234efGH'`
 *      (that "AbC-D1234efGH" part is the label). Create one conversion
 *      action per row below that you actually want to track in Ads.
 *
 * 4. META_PIXEL_ID (Facebook/Instagram Ads)
 *    → Meta Events Manager (business.facebook.com/events_manager) →
 *      Data Sources → your Pixel → "Pixel ID" at the top (a long number,
 *      e.g. "1234567890123456")
 *
 * 5. GTM_ID (Google Tag Manager — optional)
 *    → tagmanager.google.com → your container → ID shown top-left, e.g.
 *      "GTM-XXXXXXX". Only needed if you're managing extra tags through GTM
 *      beyond what this file already covers — don't duplicate GA4/Ads here
 *      AND inside the GTM container, or every event double-counts.
 *
 * You can set these two ways — pick ONE:
 *
 *   Option A (recommended): put them in client/.env (see client/.env.example)
 *   — nothing to edit here, it's picked up automatically below.
 *
 *   Option B: just hardcode the fallback values directly below (replace
 *   the empty strings). Handy if you don't want to deal with .env files.
 *
 * Leaving a value empty simply disables that specific tag/event — nothing
 * breaks, the site just won't send that particular data until you fill
 * it in.
 * ═══════════════════════════════════════════════════════════════════════════
 */

const tracking = {
  // Google Analytics 4 Measurement ID, e.g. "G-XXXXXXXXXX"
  GA4_MEASUREMENT_ID: import.meta.env.VITE_GA_MEASUREMENT_ID || '',

  // Google Ads Conversion ID, e.g. "AW-XXXXXXXXXX"
  GOOGLE_ADS_ID: import.meta.env.VITE_GOOGLE_ADS_ID || '',

  // Meta (Facebook/Instagram) Pixel ID
  META_PIXEL_ID: import.meta.env.VITE_META_PIXEL_ID || '',

  // Google Tag Manager container ID, e.g. "GTM-XXXXXXX" (from
  // tagmanager.google.com). Optional — only needed if you're using GTM for
  // additional tags beyond what this file already configures.
  GTM_ID: import.meta.env.VITE_GTM_ID || '',

  // Conversion action labels — add a row here for each conversion action
  // you create in Google Ads. The key is a friendly name used elsewhere in
  // the code (see src/utils/analytics.js) — you don't need to touch that
  // file, just fill in the label once you've created the matching
  // conversion action in Google Ads.
  GOOGLE_ADS_LABELS: {
    // Enquiry form submitted (appears on most pages)
    lead: import.meta.env.VITE_GOOGLE_ADS_LABEL_LEAD || '',
    // Admissions page form submitted specifically
    admission: import.meta.env.VITE_GOOGLE_ADS_LABEL_ADMISSION || '',
    // "Call Now" phone number clicked
    call: import.meta.env.VITE_GOOGLE_ADS_LABEL_CALL || '',
    // WhatsApp button clicked
    whatsapp: import.meta.env.VITE_GOOGLE_ADS_LABEL_WHATSAPP || '',
    // File downloaded
    tracking: import.meta.env.VITE_GOOGLE_ADS_LABEL || '',
  },

  // Every phone number used anywhere on the site, with a friendly label so
  // reports show WHICH number was clicked, not just "a phone was clicked".
  // If you add a new phone number to the site later, add it here too so it
  // shows up correctly in tracking instead of falling back to "Unknown".
  PHONE_NUMBERS: {
    '9948962952': 'Primary',
    '8886945745': 'Secondary',
    '8121571596': 'Footer Line 1',
    '8121492622': 'Footer Line 2',
  },

  // WhatsApp number(s) used on the site.
  WHATSAPP_NUMBERS: {
    '919948962952': 'Primary WhatsApp',
  },
};

export default tracking;
