// src/quan/database.mjs
import pkg from 'pg';
const { Pool } = pkg;
import { DsqlSigner } from '@aws-sdk/dsql-signer';

let pool;

async function initializePool() {
  if (!pool) {
    const signer = new DsqlSigner({
      hostname: process.env.DATABASE_HOST,
      region: process.env.DATABASE_REGION,
    });

    const token = await signer.getDbConnectAdminAuthToken();
    console.log('Admin token generated successfully');

    pool = new Pool({
      host: process.env.DATABASE_HOST,
      port: 5432,
      user: process.env.DATABASE_USER,
      password: token,
      database: process.env.DATABASE_NAME,
      ssl: true,
      max: 10,
      idleTimeoutMillis: 120000,
      connectionTimeoutMillis: 30000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      pool = null; // Reset pool for reinitialization
    });

    console.log('Connection pool initialized successfully');
  }
}

async function getPool() {
  if (!pool) {
    await initializePool();
  }
  return pool;
}

export async function query(text, params) {
  const client = await (await getPool()).connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}