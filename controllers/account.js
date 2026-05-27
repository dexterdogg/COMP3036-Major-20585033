
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sql from "../config/db.js";
import { findUserByEmail } from "../services/users.js";


//Cookie name and JWT settings same as login
const JWT_COOKIE = "auth";
const { JWT_SECRET = "dev-secret", JWT_EXPIRES = "1h" } = process.env;

// GET
export function showRegister(req, res) {
    return res.render("register", { title: "Create Account" });
}

// POST 
export async function postRegister(req, res) {
    try {
        const {
            firstName = "",
            lastName = "",
            email = "",
            password = "",
          } = req.body || {};
          
          const role = "Student";

        // Validate input
        if (!email || !password) {
            return res.status(400).render("register", { title: "Create Account", error: "Email and password are required." });
        }
        if (password.length < 8) {
            return res.status(400).render("register", { title: "Create Account", error: "Password must be at least 8 characters." });
        }

        // does user already exist?
        const already = await findUserByEmail(email);
        if (already) {
            return res.status(409).render("register", { title: "Create Account", error: "An account with that email already exists." });
        }

        // hash password
        const password_hash = await bcrypt.hash(password, 12);

        // Insert new user to database
        const rows = await sql/*sql*/`
      INSERT INTO users (email, password_hash, role, first_name, last_name)
      VALUES (${email}, ${password_hash}, ${role}, ${firstName}, ${lastName})
      RETURNING id, email, role, first_name, last_name
    `;
        const user = rows[0];

        // Create JWT and set cookie, then redirect to profile for new user
        const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

        res.cookie(JWT_COOKIE, token, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
        });

        return res.redirect("/profile");

// Catch any errors
    } catch (err) {
        console.error("postRegister error:", err);
        // Likely duplicate email if UNIQUE index fires
        return res.status(500).render("register", { title: "Create Account", error: "Could not create account. Please try again.", values: req.body || {} });
    }
}