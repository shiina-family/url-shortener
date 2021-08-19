import sqlite3 from 'sqlite3';

export class Database {
  db;

  constructor(path: string) {
    this.db = new sqlite3.Database(path);
    this.db.exec(`
         CREATE TABLE IF NOT EXISTS redirectsData (
             shorten_slug text NOT NULL UNIQUE,
             target_url text NOT NULL
         )
     `);
  }

  async fetch(shorten_slug: string) {
    const sql = `SELECT shorten_slug, target_url
                   FROM redirectsData
                  WHERE shorten_slug = ?`;
    return await new Promise<any>((resolve, reject) => {
      this.db.get(sql, [shorten_slug], (err, row) => {
        if (err !== null) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  post(shorten_slug: string, target_url: string) {
    const sql = `INSERT INTO redirectsData
                      VALUES (?, ?)`;
    this.db.run(sql, [shorten_slug, target_url]);
  }

  async isExistsSlug(slug: string) {
    const exists = await this.fetch(slug);
    return Boolean(exists)
  }
}
