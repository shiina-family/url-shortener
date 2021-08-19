import express from 'express';
import {Database} from './database';

const app = express();
const urls = new Database('urls.db');
// const statics = nantara __dirname kantara

app.get('/:id', async (req, res, next) => {
  if (req.params.id === 'script.js'
    || req.params.id === 'normalize.css'
    || req.params.id === 'style.css') {
    next();
    return;
  }
  const url = await urls.fetch(req.params.id);
  const to = url ? url.target_url : 'https://google.com';
  return res.redirect(to);
});

app.post('/register', async (req, res) => {
  const slug = req.query.slug as string;
  const target = req.query.target as string;
  if (await urls.isExistsSlug(slug)) {
    res.status(400);
    res.send('That slug already exists.');
    return;
  }
  urls.post(slug, target);
  res.status(201);
  res.send('Registered!');
});

app.use(express.static('static'));
app.listen(31857);
