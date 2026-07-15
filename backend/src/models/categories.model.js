import { pool } from "../db/pool.js";

export const createCategory = async ({
  userId,
  name,
  type,
  color,
  icon,
}) => {
  const query = `
    INSERT INTO categories (
      user_id,
      name,
      type,
      color,
      icon
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING
      id,
      user_id,
      name,
      type,
      color,
      icon,
      is_active,
      created_at,
      updated_at
  `;

  const values = [
    userId,
    name,
    type,
    color ?? null,
    icon ?? null,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

export const findCategoriesByUserId = async (userId) => {
  const query = `
    SELECT
      id,
      user_id,
      name,
      type,
      color,
      icon,
      is_active,
      created_at,
      updated_at
    FROM categories
    WHERE user_id = $1
      AND is_active = true
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query, [userId]);

  return result.rows;
};

export const findCategoryById = async (categoryId, userId) => {
  const query = `
    SELECT
      id,
      user_id,
      name,
      type,
      color,
      icon,
      is_active,
      created_at,
      updated_at
    FROM categories
    WHERE id = $1
      AND user_id = $2
      AND is_active = true
  `;

  const result = await pool.query(query, [categoryId, userId]);

  return result.rows[0] || null;
};

export const updateCategoryById = async ({
  categoryId,
  userId,
  name,
  type,
  color,
  icon,
}) => {
  const query = `
    UPDATE categories
    SET
      name = $1,
      type = $2,
      color = $3,
      icon = $4,
      updated_at = NOW()
    WHERE id = $5
      AND user_id = $6
      AND is_active = true
    RETURNING
      id,
      user_id,
      name,
      type,
      color,
      icon,
      is_active,
      created_at,
      updated_at
  `;

  const values = [
    name,
    type,
    color ?? null,
    icon ?? null,
    categoryId,
    userId,
  ];

  const result = await pool.query(query, values);

  return result.rows[0] || null;
};

export const deactivateCategoryById = async (categoryId, userId) => {
  const query = `
    UPDATE categories
    SET
      is_active = false,
      updated_at = NOW()
    WHERE id = $1
      AND user_id = $2
      AND is_active = true
    RETURNING
      id,
      user_id,
      name,
      type,
      color,
      icon,
      is_active,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [categoryId, userId]);

  return result.rows[0] || null;
};