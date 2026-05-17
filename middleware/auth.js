
import jwt from "jsonwebtoken";

const JWT_COOKIE = "auth";
const { JWT_SECRET = "dev-secret" } = process.env;

// Attach req.user if valid; otherwise redirect to /login
export function ensureAuthed(req, res, next) {
  console.log("Cookie hdr:", req.headers.cookie);
  console.log("Parsed cookie:", req.cookies);

  const token = req.cookies?.[JWT_COOKIE];
  if (!token) {
    return res.redirect("/login");
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    console.log("AUTH OK:", req.user);
    return next();
  } catch (e) {
    console.log("AUTH FAIL:", e.name, e.message); // e.g., JsonWebTokenError: invalid signature
    return res.redirect("/login");
  }
}

// If valid JWT, attach req.user; otherwise continue unauthenticated
export function maybeAuthed(req, res, next) {
  const token = req.cookies?.[JWT_COOKIE];
  if (!token) return next();
  try {
    // Verify token
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    // Set locals for views
    res.locals.isAuthed = true;
    res.locals.me = req.user; 
  } catch {
    return res.redirect("/login");
  }
  return next();
}

export function ensureAdmin(req, res, next) {
  if (!req.user) {
    return res.redirect("/login");
  }

  if (req.user.role !== "Admin") {
    return res.status(403).render("error", {
      title: "Forbidden",
      message: "You do not have permission to access this page."
    });
  }

  return next();
}