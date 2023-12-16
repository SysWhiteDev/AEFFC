import pg from 'pg'
const db = new pg.Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'postgres',
    password: 'white',
    port: 5432,
})

db.connect((err: any) => {
    if (err) {
        console.log(err);
        return
    }
    console.log('[DB] CONNECTED')
});

export default db