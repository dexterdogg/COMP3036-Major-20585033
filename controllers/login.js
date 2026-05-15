
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../services/users.js";

const JWT_COOKIE = "auth";
const { JWT_SECRET = "dev-secret", JWT_EXPIRES = "1h" } = process.env;

// GET /login
export function showLogin(req, res) {
    return res.render("login", { title: "Login", error: null });
}

// POST /login
export async function postLogin(req, res) {
    const { email, password } = req.body || {};
    const user = await findUserByEmail(email);

    // Check password 
    const ok = user && await bcrypt.compare(password, user.password_hash);
    if (!ok) {
        // On auth failure, re-render login with a generic error
        return res.status(401).render("login", { title: "Login", error: "Invalid credentials" });
    }

    // Create JWT and set as HttpOnly cookie
    const token = jwt.sign(
        { sub: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
    );

    // HttpOnly cookie; 'secure' in production
    res.cookie("auth", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
    });


    return res.redirect("/profile");
}

// POST /logout
export function postLogout(req, res) {

    // Clear the auth cookie
    res.cookie(JWT_COOKIE, "", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
    });

    return res.redirect("/login");
}
