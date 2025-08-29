// shared/database.mjs
import pkg from 'pg';
const { Pool } = pkg;
import { DsqlSigner } from '@aws-sdk/dsql-signer';
import { DATABASE_CONFIG } from './constants.mjs';

/**
 * Shared database connection utility
 * Provides a singleton pool connection that can be used across all services
 */
class DatabaseConnection {
  constructor() {
    this.pool = null;
  }

  async initializePool() {
    if (!this.pool) {
      const signer = new DsqlSigner({
        hostname: process.env.DATABASE_HOST,
        region: process.env.DATABASE_REGION,
      });

      const token = await signer.getDbConnectAdminAuthToken();

      this.pool = new Pool({
        host: process.env.DATABASE_HOST,
        port: DATABASE_CONFIG.PORT,
        user: process.env.DATABASE_USER,
        password: token,
        database: process.env.DATABASE_NAME,
        ssl: true,
        max: DATABASE_CONFIG.MAX_CONNECTIONS,
        idleTimeoutMillis: DATABASE_CONFIG.IDLE_TIMEOUT,
        connectionTimeoutMillis: DATABASE_CONFIG.CONNECTION_TIMEOUT,
      });

      this.pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
        this.pool = null; // Reset pool for reinitialization
      });
    }
  }

  async getPool() {
    if (!this.pool) {
      await this.initializePool();
    }
    return this.pool;
  }

  async query(text, params) {
    const client = await (await this.getPool()).connect();
    try {
      return await client.query(text, params);
    } finally {
      client.release();
    }
  }

  async closePool() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }
}

// Create singleton instance
const dbConnection = new DatabaseConnection();

// Export the query function for backward compatibility
export const query = (text, params) => dbConnection.query(text, params);

// Export the database connection for advanced usage
export default dbConnection;
