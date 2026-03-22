const { MongoClient } = require('mongodb');
const config = require('../config/database');

let db;

async function connectToDatabase() {
    try {
        const client = new MongoClient(config.MONGO_URL);
        await client.connect();
        console.log('Успішно підключено до MongoDB');

        db = client.db(config.DB_NAME);
        console.log(`Використовується база даних: ${config.DB_NAME}`);
        return db;
    } catch (error) {
        console.error('Помилка підключення до MongoDB:', error);
        process.exit(1);
    }
}

function getDB() {
    if (!db) {
        throw new Error('Database not initialized. Call connectToDatabase first.');
    }
    return db;
}

module
    .exports = {
    connectToDatabase,
    getDB
};