const express = require('express');
const urls = require('./urls.json');
const app = express();
app.get('/:id', async (req, res) => {
    return res.redirect(urls[req.params.id]);
});
app.listen(80);
