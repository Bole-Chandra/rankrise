import tracking from '../config/tracking';

/**
 * Thin, safe wrapper around gtag.js and the Meta Pixel (both loaded in
 * index.html). Every function here is a no-op if the relevant ID isn't
 * configured in src/config/tracking.js, so the site works fine with
 * tracking off too — nothing to guard at the call site.
 */

const gaReady = () => typeof window !== 'undefined' && typeof window.gtag === 'function';
const metaReady = () => typeof window !== 'undefined' && typeof window.fbq === 'function';

// ─── Page views ───────────────────────────────────────────────────────────────

/**
 * Fire a GA4 + Meta page_view. Needed because both scripts' automatic
 * page_view only fires once when they first load — client-side route
 * changes in a single-page app (React Router) don't trigger it again on
 * their own.
 */
export const trackPageView = (path, title) => {
  if (gaReady() && tracking.GA4_MEASUREMENT_ID) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
      page_location: window.location.href,
    });
  }
  if (metaReady() && tracking.META_PIXEL_ID) {
    window.fbq('track', 'PageView');
  }
};

// ─── Generic events ───────────────────────────────────────────────────────────

/**
 * Fire a generic GA4 event. Use this for anything you want to see in
 * Analytics → Reports → Engagement → Events.
 *
 * Example: trackEvent('click_to_call', { location: 'header' })
 */
export const trackEvent = (eventName, params = {}) => {
  if (!gaReady()) return;
  window.gtag('event', eventName, params);
};

/**
 * Fire a Meta Pixel event. Use a Meta STANDARD event name (Lead, Contact,
 * CompleteRegistration, ViewContent, etc — see Meta's Events Manager for
 * the full list) when one fits, since standard events get better ad
 * optimization than custom ones. Falls back to trackCustom for anything
 * that isn't a recognized standard event name.
 */
const META_STANDARD_EVENTS = new Set([
  'PageView', 'Lead', 'Contact', 'CompleteRegistration', 'ViewContent',
  'Search', 'AddToCart', 'InitiateCheckout', 'Purchase', 'Subscribe',
]);
export const trackMetaEvent = (eventName, params = {}) => {
  if (!metaReady() || !tracking.META_PIXEL_ID) return;
  const method = META_STANDARD_EVENTS.has(eventName) ? 'track' : 'trackCustom';
  window.fbq(method, eventName, params);
};

/**
 * Fire a Google Ads conversion. `labelKey` must match a key in
 * GOOGLE_ADS_LABELS inside src/config/tracking.js (e.g. 'lead', 'call').
 *
 * Example: trackConversion('lead', { value: 1, currency: 'INR' })
 */
export const trackConversion = (labelKey, extraParams = {}) => {
  if (!gaReady() || !tracking.GOOGLE_ADS_ID) return;
  const label = tracking.GOOGLE_ADS_LABELS[labelKey];
  if (!label) return; // that specific conversion action isn't configured yet
  window.gtag('event', 'conversion', {
    send_to: `${tracking.GOOGLE_ADS_ID}/${label}`,
    ...extraParams,
  });
};

// ─── Form tracking ─────────────────────────────────────────────────────────────

/**
 * Call once, the first time a user interacts with a form (first keystroke/
 * selection) — NOT on every field change. Fires a GA4 "form_start" event.
 * Use a ref in the component to guard against firing more than once per
 * form session — see EnquiryForm.jsx / Admissions.jsx for the pattern.
 */
export const trackFormStart = (formName) => {
  trackEvent('form_start', { form_name: formName });
};

/**
 * Fire when a lead-gen form is submitted successfully. `formType` should be
 * 'enquiry' or 'admission' — this fires the right GA4 event, the right
 * Google Ads conversion label, AND the Meta Pixel "Lead" standard event,
 * all in one call.
 */
export const trackLeadSubmitted = (formName, formType = 'enquiry') => {
  const gaEventName = formType === 'admission' ? 'admission_submitted' : 'generate_lead';
  trackEvent(gaEventName, { form_name: formName });
  trackConversion(formType === 'admission' ? 'admission' : 'lead', { value: 1, currency: 'INR' });
  trackMetaEvent('Lead', { content_name: formName });
};

// ─── Phone / WhatsApp / YouTube ────────────────────────────────────────────────

/**
 * Track a "Call Now" link click. Automatically looks up the friendly label
 * for the number from PHONE_NUMBERS in tracking.js, so reports show WHICH
 * number was clicked (e.g. "Primary" vs "Footer Line 2"), not just that
 * *a* phone was clicked.
 */
export const trackCallClick = (phone, location) => {
  const numberLabel = tracking.PHONE_NUMBERS[phone] || 'Unknown';
  trackEvent('click_to_call', { phone, number_label: numberLabel, location });
  trackConversion('call', { phone, number_label: numberLabel });
  trackMetaEvent('Contact', { content_name: `Call - ${numberLabel}`, phone });
};

/**
 * Track a WhatsApp button/link click.
 */
export const trackWhatsAppClick = (phone, location) => {
  const numberLabel = tracking.WHATSAPP_NUMBERS[phone] || 'Unknown';
  trackEvent('whatsapp_click', { phone, number_label: numberLabel, location });
  trackConversion('whatsapp', { phone, number_label: numberLabel });
  trackMetaEvent('Contact', { content_name: `WhatsApp - ${numberLabel}` });
};

/**
 * Track a YouTube channel/video link click.
 */
export const trackYouTubeClick = (location) => {
  trackEvent('youtube_click', { location });
  trackMetaEvent('ViewContent', { content_name: 'YouTube Channel', content_type: 'video' });
};

/**
 * Track a file download (brochure, etc).
 */
export const trackDownload = (fileName, conversionLabelKey) => {
  trackEvent('file_download', { file_name: fileName });
  if (conversionLabelKey) trackConversion(conversionLabelKey);
  trackMetaEvent('ViewContent', { content_name: fileName, content_type: 'document' });
};
