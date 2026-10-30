import mysql from "mysql2/promise";
import dotenv from "dotenv";

import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || '',
  ...(process.env.DB_HOST && {
    ssl: { minVersion: 'TLSv1.2' }
  })
};
const pool = mysql.createPool(dbConfig);

export async function closePool() {

  try {
    await pool.end();
    console.log("データベース接続プールを破棄しました。");
  } catch (error) {
    console.error("データベース接続プールの破棄中にエラーが発生しました：", error);
  }
}

export async function query<T = any>(sql: string, params: any[] = []) {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(sql, params);
    return rows as T[];
  } catch (error) {
    console.error('SQLの実行中にエラーが発生しました：', error);
    throw error;

  }
}

export async function exec(sql: string, params: any[] = []) {
  try {
    const [result] = await pool.execute<ResultSetHeader>(sql, params);
    return result;
  } catch (error) {
    console.error("'SQLの実行中にエラーが発生しました：", error);
    throw error;
  }
}