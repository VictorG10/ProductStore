import { neon } from "@neondatabase/serverless";

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

export const sql = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&channel_binding=require`
);

export const initDB = async () => {
  try {
    await sql`CREATE TABLE IF NOT EXISTS products(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing Database", error);
    process.exit(1);
  }
};
