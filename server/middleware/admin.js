export function requireAdmin(req, res, next) {
  if (req.headers["x-admin-key"] !== process.env.ADMIN_KEY)
    return res.status(403).json({ error: "Forbidden" });
  next();
}
