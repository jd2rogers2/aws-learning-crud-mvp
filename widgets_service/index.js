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
  res.send({ text: 'Hello World, i\'m the widgets service!!!' });
});


app.get('/widgets', async (req, res) => {
  const client = await pgPool.connect();
  try {
    const results = await client.query('SELECT * FROM widgets;');
    res.send({ widgets: results.rows });
  } finally {
    client.release();
  }
});

app.post('/widgets', async (req, res) => {
  const client = await pgPool.connect();
  try {
    const results = await client.query(
      `INSERT INTO widgets (name, description, price) VALUES ($1, $2, $3)
      RETURNING *;`,
      [req.body.name, req.body.description, req.body.price],
    );
    res.send({ widgets: results.rows });
  } finally {
    client.release();
  }
});

app.listen('8000', () => {
  console.log(`widgets service started`);
});
