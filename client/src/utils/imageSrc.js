// Same origin logic as src/utils/api.js — if the API is on a different
// domain/subdomain than the frontend (VITE_API_URL set), uploaded file
// paths like "/uploads/images/x.webp" need that same prefix, or they
// resolve against the frontend's own domain instead (where no /uploads
// route exists) and every uploaded image 404s.
const API_ORIGIN = import.meta.env.VITE_API_URL || '';

/**
 * Resolves an image field (which may be a full URL, a data: URI, an
 * uploaded file path like "/uploads/images/x.webp", or a legacy bare
 * filename from before uploads existed) into a src usable directly in
 * an <img> tag — correctly, regardless of whether the frontend and
 * backend are deployed together or on separate domains.
 */
export const getImageSrc = (img, fallback = '/assets/public/Rankriselogo.JPG') => {
  if (!img) return fallback;
  if (img.startsWith('http') || img.startsWith('data:')) return img;
  if (img.startsWith('/uploads')) return `${API_ORIGIN}${img}`;
  return `/assets/public/${img}`;
};
