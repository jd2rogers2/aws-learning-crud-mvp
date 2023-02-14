const express = require('express');
const cors = require('cors');


const app = express();

const corsOptions = {
  origin: process.env.WEB_FRONTEND_DOMAIN,
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send({ text: 'Hello World, i\'m the widgets service!!!' });
});

app.listen('8000', () => {
  console.log(`widgets service running on port 8000`);
});
