
import { findUserById } from "../services/users.js";
import { getUserEventsByID } from "../models/eventModels.js";

// GET /profile
export async function showProfile(req, res) {
    try {
        if (!req.user?.id) return res.redirect("/login");

        const me = await findUserById(Number(req.user.id));
        
        if (!me) return res.redirect("/login");
        // Transform to view model
        const viewUser = {
            id: me.id,
            email: me.email,
            role: me.role,
            firstName: me.first_name,
            lastName: me.last_name
        };
        // Get registered events for user
        const registeredEvents = await getUserEventsByID(viewUser.id);
        // Render profile view
        console.log("RENDER profile for user:", viewUser.id, viewUser.email);
        return res.render("profile", { me: viewUser, isAuthed: true, registeredEvents });
    } catch (err) {
        // Log error and show generic error message
        console.error("showProfile error:", err);
        return res.status(500).render("error", { title: "Error", message: "Failed to load profile." });
    }
}