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

router.get('/callback', (req, res, next) => {
  const code = req.query.code || null;
  if (code === null) {
    res.redirect('/?' +
    querystring.stringify({
      error: 'Authorization not provided by user'
    }));
  } else {
    const getTokenRequest = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(getTokenRequest, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        res.cookie('access_token', body.access_token);
        res.cookie('refresh_token', body.refresh_token);

        //console.log(req.cookies);
        res.redirect('/?' +
        querystring.stringify({
          error: 'logged in'
        }));
        
      } else {
        res.render('index', {
          path: 'index',
          error: 'Didnt get auth token from Spotify',
          formsCSS: true,
          productCSS: true  
        });
      }
    });
  }
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
