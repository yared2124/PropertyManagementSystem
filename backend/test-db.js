import "dotenv/config";
import pg from "pg";

const { Client } = pg;

const databaseUrl = process.env.DATABASE_URL;

function requireDatabaseUrl() {
  if (
    !databaseUrl ||
    typeof databaseUrl !== "string" ||
    databaseUrl.trim() === ""
  ) {
    throw new Error(
      "Missing or empty DATABASE_URL environment variable. Create/update backend/.env with your Postgres connection string.",
    );
  }
}

async function testConnection() {
  let client;
  try {
    requireDatabaseUrl();

    client = new Client({ connectionString: databaseUrl });
    await client.connect();

    const result = await client.query(
      "SELECT 1 AS connected, current_database() AS database, current_user AS user_name",
    );
    console.log("Database connection successful!");
    console.log("Result:", result.rows[0]);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    if (process.env.DATABASE_URL) {
      console.error("DATABASE_URL is set but connection failed. Check:");
      console.error("- Postgres server is running");
      console.error("- host/port/user/password/database name are correct");
      console.error("- the database exists");
    } else {
      console.error("- DATABASE_URL is not set");
    }
  } finally {
    if (client) await client.end();
  }
}

testConnection();
