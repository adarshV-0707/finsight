import { pool } from "../db/pool.js";

const insertTransaction = async ({
  userId,
  categoryId,
  amount,
  transactionDate,
  note,
}) => {
  const query = `
    WITH inserted_transaction AS (
      INSERT INTO transactions (
        user_id,
        category_id,
        amount,
        transaction_date,
        note
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    )
    SELECT
      it.id,
      it.user_id AS "userId",
      it.category_id AS "categoryId",
      c.name AS "categoryName",
      it.amount,
      it.note,
      it.transaction_date AS "transactionDate",
      it.created_at AS "createdAt",
      it.updated_at AS "updatedAt"
    FROM inserted_transaction it
    JOIN categories c
      ON c.id = it.category_id
  `;

  const values = [
    userId,
    categoryId,
    amount,
    transactionDate,
    note ?? null,
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};

const findTransactionsByUserId = async ({
  userId,
  categoryId,
  startDate,
  endDate,
}) => {
  const conditions = ["t.user_id = $1"];
  const values = [userId];

  if (categoryId) {
    values.push(categoryId);
    conditions.push(`t.category_id = $${values.length}`);
  }

  if (startDate) {
    values.push(startDate);
    conditions.push(`t.transaction_date >= $${values.length}`);
  }

  if (endDate) {
    values.push(endDate);
    conditions.push(`t.transaction_date <= $${values.length}`);
  }

  const query = `
    SELECT
      t.id,
      t.user_id AS "userId",
      t.category_id AS "categoryId",
      c.name AS "categoryName",
      t.amount,
      t.note,
      t.transaction_date AS "transactionDate",
      t.created_at AS "createdAt",
      t.updated_at AS "updatedAt"
    FROM transactions t
    JOIN categories c
      ON c.id = t.category_id
    WHERE ${conditions.join(" AND ")}
    ORDER BY
      t.transaction_date DESC,
      t.created_at DESC
  `;

  const { rows } = await pool.query(query, values);

  return rows;
};

const findTransactionById = async ({ transactionId, userId }) => {
  const query = `
    SELECT
      t.id,
      t.user_id AS "userId",
      t.category_id AS "categoryId",
      c.name AS "categoryName",
      t.amount,
      t.note,
      t.transaction_date AS "transactionDate",
      t.created_at AS "createdAt",
      t.updated_at AS "updatedAt"
    FROM transactions t
    JOIN categories c
      ON c.id = t.category_id
    WHERE t.id = $1
      AND t.user_id = $2
  `;

  const { rows } = await pool.query(query, [transactionId, userId]);

  return rows[0];
};

const updateTransactionById = async ({
  transactionId,
  userId,
  categoryId,
  amount,
  transactionDate,
  note,
}) => {
  const updates = [];
  const values = [];

  if (categoryId !== undefined) {
    values.push(categoryId);
    updates.push(`category_id = $${values.length}`);
  }

  if (amount !== undefined) {
    values.push(amount);
    updates.push(`amount = $${values.length}`);
  }

  if (transactionDate !== undefined) {
    values.push(transactionDate);
    updates.push(`transaction_date = $${values.length}`);
  }

  if (note !== undefined) {
    values.push(note);
    updates.push(`note = $${values.length}`);
  }

  updates.push("updated_at = NOW()");

  values.push(transactionId);
  const transactionIdPosition = values.length;

  values.push(userId);
  const userIdPosition = values.length;

  const query = `
    WITH updated_transaction AS (
      UPDATE transactions
      SET ${updates.join(", ")}
      WHERE id = $${transactionIdPosition}
        AND user_id = $${userIdPosition}
      RETURNING *
    )
    SELECT
      ut.id,
      ut.user_id AS "userId",
      ut.category_id AS "categoryId",
      c.name AS "categoryName",
      ut.amount,
      ut.note,
      ut.transaction_date AS "transactionDate",
      ut.created_at AS "createdAt",
      ut.updated_at AS "updatedAt"
    FROM updated_transaction ut
    JOIN categories c
      ON c.id = ut.category_id
  `;

  const { rows } = await pool.query(query, values);

  return rows[0];
};

const deleteTransactionById = async ({ transactionId, userId }) => {
  const query = `
    DELETE FROM transactions
    WHERE id = $1
      AND user_id = $2
    RETURNING id
  `;

  const { rows } = await pool.query(query, [transactionId, userId]);

  return rows[0];
};

export {
  insertTransaction,
  findTransactionsByUserId,
  findTransactionById,
  updateTransactionById,
  deleteTransactionById,
};