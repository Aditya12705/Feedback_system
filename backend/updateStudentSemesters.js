const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateStudentSemesters() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'feedback_system'
    });

    try {
        // Update all students from semester 1 to 2
        await connection.query(
            `UPDATE students 
             SET semester = 2 
             WHERE semester = 1`
        );

        console.log('Successfully updated student semesters');
    } catch (err) {
        console.error('Error updating semesters:', err);
    } finally {
        await connection.end();
    }
}

updateStudentSemesters();
