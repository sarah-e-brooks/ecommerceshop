const express = require('express');
const cors = require('cors');
const { Pool } = require( 'pg' );
const fs = require( 'fs' );
const path = require( 'path' );
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? +(process.env.DB_PORT) : 5432 ,
} );

const executeSqlFile = async ( filePath ) =>
{
  try
  {
    // Read the SQL file
    const sql = fs.readFileSync( filePath, 'utf8' );

    // Execute the SQL commands
    await pool.query( sql );

    console.log( 'Database schema has been created successfully.' );
  } catch ( err )
  {
    console.error( 'Error executing SQL file:', err );
  } finally
  {
    // Close the pool
    await pool.end();
  }
};

// Save cart to the database
app.post('/api/cart', async (req, res) => {
  const { cart } = req.body;
  try {
    await pool.query('DELETE FROM cart');
    const promises = cart.map(item =>
      pool.query(
        'INSERT INTO cart (id, title, image, price, amount) VALUES ($1, $2, $3, $4, $5)',
        [item.id, item.title, item.image, item.price, item.amount]
      )
    );
    await Promise.all(promises);
    res.status(200).json({ message: 'Cart saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save cart' });
  }
});

// Retrieve cart from the database
app.get('/api/cart', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cart');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve cart' });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;

const start = async () => {
  try
  {
    // connect to DB
    await pool.connect();
    const sqlFilePath = path.join( __dirname, 'cart.sql' );
    executeSqlFile( sqlFilePath );
    console.log( 'Connected to the database' );
    app.listen( PORT, () =>
    {
      console.log( `Server running on http://localhost:${ PORT }` );
    } );
  } catch (error) {
    console.error( 'Failed to connect to the database:', error );
    console.log( "Did not start server...." );
  }
};

start();
