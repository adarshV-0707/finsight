import { pool } from "../db/pool.js";

// Returns all predefined categories.
const findAllCategories = async () => {
  const query = `
    SELECT
      id,
      name
    FROM categories
    ORDER BY
      CASE WHEN name = 'Other' THEN 1 ELSE 0 END,
      name ASC
  `;

  const result = await pool.query(query);

  return result.rows;
};

// Finds one predefined category by ID.
// Used internally while creating or updating transactions and budgets.
const findCategoryById = async (categoryId) => {
  const query = `
    SELECT
      id,
      name
    FROM categories
    WHERE id = $1
  `;

  const result = await pool.query(query, [categoryId]);

  return result.rows[0] || null;
};

export {
  findAllCategories,
  findCategoryById,
};