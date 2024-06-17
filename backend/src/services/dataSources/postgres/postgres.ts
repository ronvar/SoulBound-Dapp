import { config } from "dotenv";
import { Pool } from "pg";

config();

const PGHOST = process.env.PGHOST;
if (!PGHOST) throw new Error("PGHOST is not set");

const PGPORT = process.env.PGPORT;
if (!PGPORT) throw new Error("PGPORT is not set");

const PGUSER = process.env.PGUSER;
if (!PGUSER) throw new Error("PGUSER is not set");

const PGDATABASE = process.env.PGDATABASE;
if (!PGDATABASE) throw new Error("PGDATABASE is not set");

const PGPASSWORD = process.env.PGPASSWORD;
if (!PGPASSWORD) throw new Error("PGPASSWORD is not set");

export const pgPool = new Pool({
  user: PGUSER,
  password: PGPASSWORD,
  host: PGHOST,
  database: PGDATABASE,
  port: parseInt(PGPORT || "6543"),
  max: 100, // Maximum number of clients in the pool
  idleTimeoutMillis: 30_000, // 30 seconds idle time before closing a client
  connectionTimeoutMillis: 60_000, // 60 seconds timeout when acquiring a connection from the pool
  ssl: {
    rejectUnauthorized: false,
  },
});
