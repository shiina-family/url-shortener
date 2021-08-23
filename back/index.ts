import { SlowBuffer } from 'buffer';
import dotenv from 'dotenv';
import express, { NextFunction } from 'express';
import { join } from 'path';
import { URL } from 'url';
import { Database } from './database';

dotenv.config({ path: join(__dirname, '../.env') });

const urls = new Database(join('back', 'urls.db'));

const app = express();

app.use(express.static('front/static', { fallthrough: true }));

app.get('/admin', async (_req, res) => {
  return res.send(await urls.fetchAll())
});

app.get('/:id', async (req, res) => {
  const url = await urls.fetch(req.params.id);
  const to = url ? url.target_url : 'https://google.com';
  return res.redirect(to);
});

const modifySlug = (slug: string) => {
  return slug.trim().replace(/ /g, '-').replace(/　/g, '-');
}

const isEmpty = (slug: string) => {
  return slug === ''
};

const includesAny = (arr: string[], target: string) => arr.some(el => target.includes(el));

function isURL(str: string) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i' // fragment locator
  );
  return pattern.test(str);
}

function isValidURL(url: string) {
  try {
    new URL(url);
    console.log("a")
    return true;
  } catch {
    console.log("b")
    return false;
  }
}

const validateRequest = async (slug: string, target: string) => {
  const message = 
    isEmpty(slug)
      ? 'A slag cannot be empty.' :

    includesAny(["\\", "/"], slug)
      ? 'That slug is not valid.' :

    !isURL(new URL(slug, 'https://u.shiina.family/').toString())
      ? 'That slug is not valid.' :

    await urls.isExistsSlug(slug)
      ? 'That slug already exists.' :

    !isValidURL(target)
      ? `${target} is not a valid URL` : null
  ;
  return { message, isValid: message === null };
};

app.post('/register', async (req, res) => {
  const slug = modifySlug(req.query.slug as string)
  const target = req.query.target as string;
  const { message, isValid } = await validateRequest(slug, target);

  if (!isValid) {
    return res.status(400).send(message);
  }
  
  urls.post(slug, target);
  res.status(201).send('Registered!');
});

app.listen(process.env.PORT);
