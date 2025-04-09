const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'feedback_system',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verify database connection
pool.getConnection()
    .then(conn => {
        console.log('Database connection established successfully.');
        conn.release();
    })
    .catch(err => {
        console.error('Error establishing database connection:', err);
    });

async function withTransaction(callback) {
    const connection = await pool.getConnection();
    try {
        await connection.query('START TRANSACTION');
        const result = await callback(connection);
        await connection.query('COMMIT');
        return result;
    } catch (error) {
        await connection.query('ROLLBACK');
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    query: pool.execute.bind(pool),
    withTransaction,
    pool
};
