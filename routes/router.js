
const express = require('express');
const pages = require('./controllers/pages.js');
const forms = require('./controllers/forms.js');

const router = express.Router();

// get
router.get('/', pages.index);

// post
router.post('/create-game', forms.createGame);

// 404
router.use(pages.notFound);

module.exports = router;