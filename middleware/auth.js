import jwt from "jsonwebtoken";

const JWT_COOKIE = "auth";
const { JWT_SECRET = "dev-secret" } = process.env;

/**
 * Strict authentication guard.
 * Use this only on routes that must require login.
 */
export function ensureAuthed(req, res, next) {
  const token = req.cookies?.[JWT_COOKIE];

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    res.locals.isAuthed = true;
    res.locals.me = req.user;

    return next();
  } catch (err) {
    res.clearCookie(JWT_COOKIE, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return res.redirect("/login");
  }
}


export function maybeAuthed(req, res, next) {
  res.locals.isAuthed = false;
  res.locals.me = null;

  const token = req.cookies?.[JWT_COOKIE];

  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    res.locals.isAuthed = true;
    res.locals.me = req.user;
  } catch (err) {
    res.clearCookie(JWT_COOKIE, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    req.user = null;
    res.locals.isAuthed = false;
    res.locals.me = null;
  }

  return next();
}

/**
 * Admin-only guard.
 * Put ensureAuthed before this on protected admin routes.
 */
export function ensureAdmin(req, res, next) {
  if (!req.user) {
    return res.redirect("/login");
  }

  if (req.user.role !== "Admin") {
    return res.status(403).render("error", {
      title: "Forbidden",
      message: "You do not have permission to access this page.",
    });
  }

  return next();
}