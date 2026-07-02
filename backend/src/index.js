import dotenv from "dotenv";
import { app } from "./app.js";
import { pool } from "./db/pool.js";


dotenv.config();


const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("PostgreSQL connected successfully:", result.rows[0].now);

    app.listen(PORT, () => {
      console.log(`FinSight server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("PostgreSQL connection failed:", error);
    process.exit(1);
  }
};

startServer();