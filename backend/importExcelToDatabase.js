const xlsx = require('xlsx');
const db = require('./db'); // Ensure this points to your database connection file

async function importExcelToDatabase(filePath, tableName) {
    try {
        console.log(`Reading Excel file: ${filePath}`);
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Use the first sheet
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        console.log(`Inserting data into table: ${tableName}`);
        for (const row of data) {
            // Map 'usn' to 'studentId' if necessary
            if (row.usn) {
                row.studentId = row.usn;
                delete row.usn; // Remove 'usn' to avoid conflicts
            }

            // Ensure 'semester' is present and valid
            if (!row.semester) {
                console.error(`Missing 'semester' for row:`, row);
                throw new Error(`Field 'semester' is required but missing in the Excel file.`);
            }

            const columns = Object.keys(row).join(', ');
            const placeholders = Object.keys(row).map(() => '?').join(', ');
            const values = Object.values(row);

            const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
            await db.query(query, values);
        }

        console.log('Data imported successfully!');
    } catch (error) {
        console.error('Error importing data:', error.message);
    } finally {
        process.exit();
    }
}

// Example usage
const filePath = 'd:\\Desktop\\FeedBack\\backend\\students.xlsx'; // Path to your Excel file
const tableName = 'students'; // Target table in the database
importExcelToDatabase(filePath, tableName);
