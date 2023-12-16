import pg from 'pg';
import 'dotenv/config';
const { Pool } = pg;

const db = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

// const db = new pg.Client({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASS,
//     port: Number(process.env.DB_PORT),
// })

db.connect((err: any) => {
    if (err) {
        console.log(err);
        return
    }
    console.log('[DB] CONNECTED')
});

export default db