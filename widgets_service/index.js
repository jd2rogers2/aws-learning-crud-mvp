const express = require('express');
const cors = require('cors');


const app = express();

const corsOptions = {
  origin: process.env.WEB_FRONTEND_DOMAIN,
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));
// app.use(express.json());

app.get('/', (req, res) => {
  res.send({ text: 'Hello World, i\'m the widgets service!!!' });
});

app.listen('8000', () => {
  console.log(`widgets service running on port 8000`);
});

const Pool = require('pg-pool');
const url = require('url');

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  // ssl: true,
};

const pool = new Pool(config);

app.get('/widgets', async (req, res) => {
  const client = await pool.connect();
  try {
    const results = await client.query('select * from widgets;');
    res.send({ widgets: results.rows });
  } finally {
    client.release()
  }
});

app.post('/widgets', async (req, res) => {
  const client = await pool.connect();
  try {
    console.log('req-----------', req)
    console.log('req.body-----------', req.body)
    const results = await client.query(
      'INSERT INTO widgets (name, description, price) VALUES ($1, $2, $3);',
      [req.body.name, req.body.description, req.body.price],
    );
    res.send({ widgets: results });
  } finally {
    client.release()
  }
});
