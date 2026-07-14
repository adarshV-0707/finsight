import { pool } from "../db/pool.js";

// Create a new user.
// The password passed here must already be hashed.
export const createUser = async ({ name, email, password }) => {
    const query = `
        INSERT INTO users (
            name,
            email,
            password
        )
        VALUES ($1, $2, $3)
        RETURNING
            id,
            name,
            email,
            created_at,
            updated_at
    `;

    const values = [name, email, password];

    const result = await pool.query(query, values);

    return result.rows[0];
};

// Find a user by email.
// Required during registration and login.
export const findUserByEmail = async (email) => {
    const query = `
        SELECT
            id,
            name,
            email,
            password,
            refresh_token,
            created_at,
            updated_at
        FROM users
        WHERE email = $1
    `;

    const result = await pool.query(query, [email]);

    return result.rows[0] || null;
};

// Find a user by id.
// Required for protected routes and current-user functionality.
export const findUserById = async (userId) => {
    const query = `
        SELECT
            id,
            name,
            email,
            created_at,
            updated_at
        FROM users
        WHERE id = $1
    `;

    const result = await pool.query(query, [userId]);

    return result.rows[0] || null;
};


// Save or remove the user's refresh token.
export const updateUserRefreshToken = async (userId, refreshToken) => {
    const query = `
        UPDATE users
        SET
            refresh_token = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id
    `;

    const result = await pool.query(query, [refreshToken, userId]);

    return result.rows[0] || null;
};

export const findUserWithRefreshTokenById = async (userId) => {
  const query = `
    SELECT
      id,
      name,
      email,
      refresh_token,
      created_at,
      updated_at
    FROM users
    WHERE id = $1
  `;

  const result = await pool.query(query, [userId]);

  return result.rows[0] || null;
};