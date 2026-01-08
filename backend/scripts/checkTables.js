const mysql = require('mysql2/promise');
require('dotenv').config({ path: __dirname + '/../env' });

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.query("SHOW TABLES LIKE 'tasks%'");
    console.log('Matching tables:', rows);
    await connection.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();