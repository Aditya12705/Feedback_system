const db = require('./db'); // Ensure this points to your database connection file

async function clearTrialFeedback() {
    console.log('Clearing trial feedback data...');
    try {
        // Delete all trial feedback data
        await db.query('DELETE FROM scores WHERE comment LIKE "This is a comment for%"');
        console.log('Trial feedback data cleared successfully!');
    } catch (error) {
        console.error('Error clearing trial feedback data:', error.message);
    } finally {
        process.exit();
    }
}

clearTrialFeedback();
