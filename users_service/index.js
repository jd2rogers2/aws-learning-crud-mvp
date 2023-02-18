const express = require('express');
const cors = require('cors');
const { pgPool } = require('./pgPool');


const app = express();

const corsOptions = {
  origin: process.env.WEB_FRONTEND_DOMAIN,
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ text: 'Hello World, i\'m the user service!!!' });
});

app.get('/users', async (req, res) => {
  const client = await pgPool.connect();
  try {
    const results = await client.query('SELECT id, email, "createdAt" FROM users;');
    res.send({ users: results.rows });
  } finally {
    client.release();
  }
});

app.post('/users', async (req, res) => {
  const client = await pgPool.connect();
  try {
    const results = await client.query(
      `INSERT INTO users (email, password) VALUES ($1, $2)
      RETURNING id, email, "createdAt";`,
      [req.body.email, req.body.password],
    );
    res.send({ users: results.rows });
  } finally {
    client.release();
  }
});

app.listen('8000', () => {
  console.log(`users service started`);
});
