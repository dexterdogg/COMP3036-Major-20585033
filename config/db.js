import postgres from 'postgres';

const sql = postgres({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    username: 'postgres',
    password: 'postgres'
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
