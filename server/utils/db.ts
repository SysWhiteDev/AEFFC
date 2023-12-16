import fs from 'fs';
const sql = fs.readFileSync('~/migrations/base.sql').toString();


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
    db.query(sql, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('[DB] SETUP COMPLETE');
    });
});

export default db