import mysql from 'mysql'

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Admin@123',
    database: 'whisked_stories'
})

connection.connect((err) => {
    if(err)
    {
        console.error('Error connecting to database', err);
        return;
    }

    console.log('Connected to database')
})

export default connection;