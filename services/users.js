import sql from "../config/db.js";;

/**
 * Find a user by email (case-insensitive).
 * Returns: { id, email, password_hash, role, first_name, last_name } or undefined
 */
export async function findUserByEmail(email) {
  const rows = await sql/*sql*/`
    SELECT id, email, password_hash, role, first_name, last_name
    FROM users
    WHERE LOWER(email) = LOWER(${email})
    LIMIT 1
  `;
  return rows[0];
}

/**
 * Find a user by id.
 * Returns: { id, email, role, first_name, last_name } or undefined
 */
export async function findUserById(id) {
  const rows = await sql/*sql*/`
    SELECT id, email, role, first_name, last_name
    FROM users
    WHERE id = ${id}
    LIMIT 1
  `;
  return rows[0];
}