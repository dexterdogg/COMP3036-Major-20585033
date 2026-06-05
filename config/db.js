import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

const sql = connectionString
  ? postgres(connectionString, {
      ssl: 'require',
    })
  : postgres({
      host: process.env.PGHOST || 'db',
      port: Number(process.env.PGPORT || 5432),
      database: process.env.PGDATABASE || 'postgres',
      username: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
    });

export default sql;

(async () => {
  try {
    const result = await sql`SELECT NOW()`;
    console.log(`connection was successful ${result[0].now}`);
  } catch (error) {
    console.error(`Failed to connect to the DB ${error}`);
  }
})();