/**
 * Minimal NoSQL-injection guard, safe for Express 5.
 *
 * `express-mongo-sanitize` (the popular package for this) tries to
 * reassign `req.query`, which Express 5 turned into a read-only getter —
 * that throws a TypeError on every single request and breaks the whole
 * API. This does the same job (strip `$` and `.` keys that could be used
 * for MongoDB operator injection) without touching `req.query` at all.
 */
const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    const clean = {};
    for (const key of Object.keys(value)) {
      if (key.startsWith('$') || key.includes('.')) continue; // drop dangerous keys
      clean[key] = sanitizeValue(value[key]);
    }
    return clean;
  }
  return value;
};

const sanitizeBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  if (req.params && typeof req.params === 'object') {
    for (const key of Object.keys(req.params)) {
      if (typeof req.params[key] === 'string' && (req.params[key].startsWith('$') || req.params[key].includes('.'))) {
        req.params[key] = req.params[key].replace(/^\$+/, '').replace(/\./g, '');
      }
    }
  }
  next();
};

module.exports = sanitizeBody;
