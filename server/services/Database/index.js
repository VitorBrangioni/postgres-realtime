const pg = require('pg');

class Database {
  pgPool;
  pgClient;

  constructor() {
    this.pgPool = new pg.Pool({
      host: '0.0.0.0',
      user: 'postgres',
      password: 'postgres',
      database: 'postgres',
      port: 5432,
    });
  }

  async connect() {
    try {
      this.pgClient = await this.pgPool.connect();
    } catch (error) {
      console.log('Connection error' , error)
    }
  }

  async query({ text, params }) {
    const res = await this.pgClient.query(text, params);

    return res;
  }

  disconnect() {
    this.pgClient.release();
  }

  async disconnectPool() {
    await this.pgPool.end();
  }
}

module.exports = Database;