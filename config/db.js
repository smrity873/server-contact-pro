const mysql = require('mysql2');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

let db;

if (process.env.NODE_ENV === 'development') {
    // MySQL connection for development
    db = mysql.createConnection({
        host: process.env.DB_HOST_DEV,
        user: process.env.DB_USER_DEV,
        password: process.env.DB_PASS_DEV,
        database: process.env.DB_NAME_DEV,
    });

    db.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL: ', err);
            return;
        }
        console.log('Connected to MySQL (development)');
    });

} else if (process.env.NODE_ENV === 'production') {
    // PostgreSQL connection for production
    db = new Pool({
        host: process.env.DB_HOST_PROD,
        user: process.env.DB_USER_PROD,
        password: process.env.DB_PASS_PROD,
        database: process.env.DB_NAME_PROD,
    });

    db.connect((err) => {
        if (err) {
            console.error('Error connecting to PostgreSQL: ', err);
            return;
        }
        console.log('Connected to PostgreSQL (production)');
    });
}

module.exports = db;