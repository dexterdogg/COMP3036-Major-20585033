import postgres from 'postgres';

const sql = postgres({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || 'postgres',
  username: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres'
});

export default sql;

// Let test the connection and setup basic table
(async () => {
    try {
        let result = await sql`SELECT NOW()`;
        console.log(`connection was successful ${result[0].now}`);
    } catch (error) {
        console.error(`Failed to connect to the DB ${error}`);
    }
})();
