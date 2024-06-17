import { pgPool } from "../../services/dataSources/postgres/postgres";
import { User } from "../../types/user";

export const getUser = async (
  user_id?: string,
  dynamic_user_id?: string,
  email?: string
): Promise<User | undefined> => {
  if (!user_id && !dynamic_user_id && !email) {
    console.error("No user_id, dynamic_user_id, or email provided", {
        user_id,
        dynamic_user_id,
        email,
        
    });
    return undefined;
  }
  const db = pgPool;
  let query = `
    SELECT
      u.user_id,
      u.created_at,
      u.last_updated,
      u.wallet_address,
      u.dynamic_user_id,
      u.email
    FROM data.users u
  `;

  let whereClauses: string[] = [];
  const params = [];
  if (user_id) {
    whereClauses.push(`u.user_id = $${params.length + 1}`);
    params.push(user_id);
  }
  if (dynamic_user_id) {
    whereClauses.push(`u.dynamic_user_id = $${params.length + 1}`);
    params.push(dynamic_user_id);
  }
  if (email) {
    whereClauses.push(`u.email = $${params.length + 1}`);
    params.push(email);
  }
  if (whereClauses.length) {
    query += ` WHERE ${whereClauses.join(" OR ")}`;
  }

  const result = await db.query<User>(query, params);
  return result.rows[0];
};

export const saveUser = async (
  user: Partial<User>
): Promise<User | undefined> => {
  try {
    const db = pgPool;
    const query = `
      UPDATE data.users
      SET
        last_updated = now(),
        wallet_address = $1,
        dynamic_user_id = $2,
        email = $3
      WHERE user_id = $4
      RETURNING *;
    `;
    const values = [
      user?.wallet_address || null,
      user?.dynamic_user_id || null,
      user?.email || null,
      user?.user_id,
    ];
    const result = await db.query<User>(query, values);
    const savedUserAccount = result.rows[0];
    return savedUserAccount;
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
};

export const insertNewUser = async (
  user: Partial<User>
): Promise<User | undefined> => {
  try {
    const db = pgPool;
    const query = `
      INSERT INTO data.users (user_id, created_at, last_updated, wallet_address, dynamic_user_id, email)
      VALUES (uuid_generate_v4(), now(), now(), $1, $2, $3)
      RETURNING *;
    `;
    const values = [
      user?.wallet_address || null,
      user?.dynamic_user_id || null,
      user?.email || null,
    ];
    const result = await db.query(query, values);
    const insertedAccount = result.rows[0];
    return insertedAccount;
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
};
