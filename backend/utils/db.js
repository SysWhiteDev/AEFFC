import pg from "pg";
import "dotenv/config";
const { Pool } = pg;

// const db = new Pool({
//     connectionString: process.env.POSTGRES_URL + "?sslmode=require",
// });

const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "white",
  port: 5432,
});

const sql = `
CREATE TABLE IF NOT EXISTS settings(                                                                                     
 maintenance BOOLEAN,                                                                                     
 maintenanceText TEXT,                                                                                    
 canvasWidth INT,                                                                                       
 canvasHeight INT,                                                                                      
 pixelSize INT                                                                                       
); 

INSERT INTO settings(maintenance, canvasWidth, canvasHeight, pixelSize) 
SELECT * FROM (
 SELECT FALSE, 3000, 2000, 10
) AS tmp
WHERE NOT EXISTS (
 SELECT maintenance FROM settings
);

CREATE TABLE IF NOT EXISTS grid(
 x INT,
 y INT,
 color VARCHAR(6) CHECK (color ~* '^[a-f0-9]{6}$')
);
`;

db.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("[DB] CONNECTED");
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
  });
});

export default db;
