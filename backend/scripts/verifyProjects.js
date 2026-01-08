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

    const [rows1] = await connection.query("SHOW TABLES LIKE 'projects'");
    const [rows2] = await connection.query("SHOW TABLES LIKE 'projects_act7'");
    console.log('projects table exists:', rows1.length > 0);
    console.log('projects_act7 table exists:', rows2.length > 0);

    if (rows2.length > 0) {
      const [projRows] = await connection.query('SELECT id, name, status, createdAt FROM `projects_act7` LIMIT 50');
      console.log('projects_act7 rows:', projRows.length);
      console.table(projRows);
    }

    // Insert a test project
    const [insertResult] = await connection.query("INSERT INTO `projects_act7` (`name`,`description`,`status`, `createdAt`) VALUES (?, ?, ?, NOW())", ['Test Project via script', 'Inserted for verification', 'planned']);
    console.log('Inserted id:', insertResult.insertId);

    const [projRowsAfter] = await connection.query('SELECT id, name, status, createdAt FROM `projects_act7` WHERE id = ? LIMIT 1', [insertResult.insertId]);
    console.log('Inserted row:');
    console.table(projRowsAfter);

    await connection.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();