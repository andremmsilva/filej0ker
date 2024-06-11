import pg from 'pg';

const connectionString = process.env.POSTGRES_URL!;

const pool = new pg.Pool({
  connectionString,
  max: 20,
});

export { pool };
