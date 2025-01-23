const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

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
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
