const path = require('path');

const express = require('express');
const querystring = require('querystring');
const request = require('request');
const rootDir = require('../util/path');
const router = express.Router();

const client_id = process.env.client_id;
const client_secret = process.env.client_secret;
const redirect_uri = process.env.redirect_uri;

router.get('/login', (req, res, next) => {
  const scope = 'user-read-private user-top-read user-read-recently-played user-read-recently-played';
  //add state param
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri
    }));
});
router.get('/', (req, res, next) => {
    
  console.log(req.query);
  res.render('index', {
    path: 'index',
    error: req.query.error,
    formsCSS: true,
    productCSS: true  });
  });

module.exports = router;
