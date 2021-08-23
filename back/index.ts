import dotenv from 'dotenv';
import express from 'express';
import { join } from 'path';
import { URL } from 'url';
import { Database } from './database';

dotenv.config({ path: join(__dirname, '../.env') });

const urls = new Database(join('back', 'urls.db'));
const app = express();

app.use(express.static('front/static', { fallthrough: true }));

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

  const isAnyIncludes = (arr: string[], target: string): boolean => arr.some(el => target.includes(el));

  if (slug === '') {
    return res.status(400).send('ERROR: slug is empty.');
  }

  if (isAnyIncludes(["\\", "/"], slug)) {
    return res.status(400).send(`ERROR: ${slug} is not a valid slug`);
  }

  const isURL = (str: string) => {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(str);
  }
  let tmp = new URL(slug, 'https://example.com/');
  if (!isURL(tmp.toString())) {
    return res.status(400).send(`ERROR: ${slug} is not a valid slug`);
  }

  try {
    new URL(target);
  } catch (error) {
    return res.status(400).send(`ERROR: ${error.input} is not a valid URL`);
  }

  if (await urls.isExistsSlug(slug)) {
    return res.status(400).send('ERROR: That slug is already exists.');
  }

  urls.post(slug, target);
  res.status(201).send('Registered!');
});

app.listen(process.env.PORT);
