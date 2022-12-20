import express from 'express';


const app = express();

app.get('/', (req, res) => {
  res.send('Hello World, i\'m the widgets service');
});

app.listen('8000', () => {
  console.log(`widgets service running on port 8000`);
});
