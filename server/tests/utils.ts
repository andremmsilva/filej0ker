import { pool } from '../src/middleware/db';

export async function truncateAndReset() {
  const client = await pool.connect();

  try {
    console.log(
      `Truncating all tables and resetting sequences in the ${process.env.NODE_ENV} database...`
    );

    await client.query('BEGIN');

    // Disable triggers
    const disableTriggers = `
      DO $$ 
      DECLARE 
        table_name text;
      BEGIN 
        FOR table_name IN
          SELECT tablename 
          FROM pg_tables 
          WHERE schemaname = 'public'
        LOOP
          EXECUTE 'ALTER TABLE ' || quote_ident(table_name) || ' DISABLE TRIGGER ALL';
        END LOOP;
      END $$;
    `;
    await client.query(disableTriggers);

    // Truncate all tables and reset sequences
    const truncateTables = `
      DO $$
      DECLARE
          table_name text;
          seq_name text;
      BEGIN
          -- Truncate all tables
          FOR table_name IN
              SELECT tablename
              FROM pg_tables
              WHERE schemaname = 'public'
          LOOP
              EXECUTE 'TRUNCATE TABLE ' || quote_ident(table_name) || ' RESTART IDENTITY CASCADE';
          END LOOP;

          -- Reset sequences
          FOR seq_name IN
              SELECT sequence_name
              FROM information_schema.sequences
              WHERE sequence_schema = 'public'
          LOOP
              EXECUTE 'ALTER SEQUENCE ' || quote_ident(seq_name) || ' RESTART WITH 1';
          END LOOP;
      END
      $$;
    `;
    await client.query(truncateTables);

    // Enable triggers
    const enableTriggers = `
      DO $$ 
      DECLARE 
        table_name text;
      BEGIN 
        FOR table_name IN
          SELECT tablename 
          FROM pg_tables 
          WHERE schemaname = 'public'
        LOOP
          EXECUTE 'ALTER TABLE ' || quote_ident(table_name) || ' ENABLE TRIGGER ALL';
        END LOOP;
      END $$;
    `;
    await client.query(enableTriggers);

    await client.query('COMMIT');

    console.log('All tables truncated and sequences reset successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error during truncation and reset:', err);
  } finally {
    client.release();
  }
}
