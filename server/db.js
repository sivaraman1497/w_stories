import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.production'});

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }

  console.log('Connected to database');
  // Log environment variables again to confirm connection
  /* console.log('Connected to the DB:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  }); */
});

export default connection;
