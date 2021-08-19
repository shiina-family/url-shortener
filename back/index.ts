import express from 'express';
import {Database} from './database';
import {join} from 'path';
import dotenv from 'dotenv';

dotenv.config({path: join(__dirname, '../.env')});

const urls = new Database(join('back', 'urls.db'));
const app = express();

app.use(express.static('front/static', {fallthrough: true}));
app.get('/:id', async (req, res) => {
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

app.listen(process.env.PORT);
