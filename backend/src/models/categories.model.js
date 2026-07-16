import { pool } from "../db/pool.js";

const insertCategory = async ({ userId, name, type }) => {
  const query = `
    INSERT INTO categories (
      user_id,
      name,
      type
    )
    VALUES ($1, $2, $3)
    RETURNING
      id,
      user_id,
      name,
      type,
      is_active,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [
    userId,
    name,
    type,
  ]);

  return result.rows[0];
};

const findCategoriesByUserId = async (userId, type) => {
  let query = `
    SELECT
      id,
      user_id,
      name,
      type,
      is_active,
      created_at,
      updated_at
    FROM categories
    WHERE user_id = $1
      AND is_active = true
  `;

  const values = [userId];

  if (type) {
    query += ` AND type = $2`;
    values.push(type);
  }

  query += ` ORDER BY created_at DESC`;

  const result = await pool.query(query, values);

  return result.rows;
};

const findCategoryById = async (categoryId, userId) => {
  const query = `
    SELECT
      id,
      user_id,
      name,
      type,
      is_active,
      created_at,
      updated_at
    FROM categories
    WHERE id = $1
      AND user_id = $2
      AND is_active = true
  `;

  const result = await pool.query(query, [
    categoryId,
    userId,
  ]);

  return result.rows[0] || null;
};

const updateCategoryById = async (
  categoryId,
  userId,
  updates,
) => {
  const fieldMap = {
    name: "name",
    type: "type",
  };

  const setClauses = [];
  const values = [];

  Object.entries(updates).forEach(([field, value]) => {
    const column = fieldMap[field];

    if (column) {
      values.push(value);
      setClauses.push(`${column} = $${values.length}`);
    }
  });

  values.push(categoryId, userId);

  const categoryIdPosition = values.length - 1;
  const userIdPosition = values.length;

  const query = `
    UPDATE categories
    SET
      ${setClauses.join(", ")},
      updated_at = NOW()
    WHERE id = $${categoryIdPosition}
      AND user_id = $${userIdPosition}
      AND is_active = true
    RETURNING
      id,
      user_id,
      name,
      type,
      is_active,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);

  return result.rows[0] || null;
};

export {
  insertCategory,
  findCategoriesByUserId,
  findCategoryById,
  updateCategoryById,
};