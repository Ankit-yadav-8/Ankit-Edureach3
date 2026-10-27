/**
 * Global NoSQL Injection Prevention Middleware
 * Recursively strips keys starting with '$' or containing '.' from request body, query, and params.
 * Prevents attackers from injecting MongoDB operators (e.g. {"$gt": ""}, {"$ne": null}, {"$where": "..."}).
 */
export function sanitizeNoSql(req, _res, next) {
  const sanitize = (val) => {
    if (!val || typeof val !== "object") return;
    if (Array.isArray(val)) {
      for (let i = 0; i < val.length; i++) {
        sanitize(val[i]);
      }
      return;
    }
    for (const key of Object.keys(val)) {
      if (key.startsWith("$") || key.includes(".")) {
        delete val[key];
      } else {
        sanitize(val[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
}
