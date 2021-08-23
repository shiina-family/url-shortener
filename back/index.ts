import dotenv from 'dotenv';
import express from 'express';
import {join} from 'path';
import {URL} from 'url';
import {Database} from './database';

dotenv.config({path: join(__dirname, '../.env')});

const urls = new Database(join('back', 'urls.db'));
const app = express();

app.use(express.static('front/static', {fallthrough: true}));

app.get('/admin', async (req, res) => {
  return res.send(await urls.fetchAll())
});

app.get('/:id', async (req, res) => {
  const url = await urls.fetch(req.params.id);
  const to = url ? url.target_url : 'https://google.com';
  return res.redirect(to);
});


app.post('/register', async (req, res) => {
  const slug = req.query.slug as string;
  const target = req.query.target as string;

  if (slug === '') {
    return res.status(400).send('ERROR: slug is empty.');
  }
  try {
    new URL(target);
  } catch (error) {
    return res.status(400).send(`${error.input} is not a valid url`);
  }

  if (await urls.isExistsSlug(slug)) {
    return res.status(400).send('That slug is already exists.');
  }

  urls.post(slug, target);
  res.status(201).send('Registered!');
});

app.listen(process.env.PORT);
