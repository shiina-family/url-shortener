import express from 'express';
import {Database} from './database';

const app = express();
const urls = new Database('urls.db');

app.get('/:id', async (req, res, next) => {
  if (req.params.id == 'script.js' || req.params.id === "helloworld"){
    next()
    return;
  }
  const url = await urls.fetch(req.params.id);
  const to = url ? url.target_url : 'https://google.com';
  return res.redirect(to);
});

app.get("/helloworld", async(_, res) => {
  res.status(200).send('Hello!World')
})

app.post('/register', async (req, res) => {
  const slug = req.query.slug as string;
  const target = req.query.target as string;
  urls.post(slug, target);
});

app.use(express.static('static'));
app.listen(31857);
