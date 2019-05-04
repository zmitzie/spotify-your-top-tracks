const path = require('path');
const express = require('express');
const querystring = require('querystring');
const request = require('request');
const rootDir = require('../util/path');
const router = express.Router();

const client_id = process.env.client_id;
const client_secret = process.env.client_secret;
const redirect_uri = process.env.redirect_uri;


const clearCookies = (req, res) => {
  cookie = req.cookies;
  for (var prop in cookie) {
    if (!cookie.hasOwnProperty(prop)) {
      continue;
    }
    res.cookie(prop, '', { expires: new Date(0) });
  }
}
router.get('/login', (req, res, next) => {
  const scope = 'user-top-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri
    }));
});

router.get('/logout', (req, res, next) => {
  clearCookies(req, res);
  res.redirect('/?' +
    querystring.stringify({
      success: 'You have been successfully logged out. You may also want to logout from https://accounts.spotify.com'
    }));
});

router.get('/callback', (req, res, next) => {
  const code = req.query.code || null;
  if (code === null) {
    res.redirect('/?' +
      querystring.stringify({
        error: 'Authorization was not provided by the user. Please try again.'
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
    request.post(getTokenRequest, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        res.cookie('access_token', body.access_token);
        res.cookie('refresh_token', body.refresh_token);
        const getUserProfile = {
          url: 'https://api.spotify.com/v1/me',
          headers: {
            'Authorization': 'Bearer ' + body.access_token
          },
          json: true
        };
        request.get(getUserProfile, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            res.cookie('spotify_user', body.display_name);
            res.redirect('/?' +
              querystring.stringify({
                success: 'You have successfully logged in.'
              }));
          }
        });
      } else {
        clearCookies(req, res);
        res.redirect('/?' +
          querystring.stringify({
            error: 'Something went wrong obtaining the access token from Spotify. Please try again.'
          }));
      }
    });
  }
});

router.get('/top_artists', (req, res, next) => {
  if (!req.cookies.access_token) {
    res.redirect('/login');
  } else {
    const getTopArtists = {
      url: 'https://api.spotify.com/v1/me/top/artists?limit=50',
      headers: {
        'Authorization': 'Bearer ' + req.cookies.access_token
      },
      json: true
    };

    request.get(getTopArtists, function (error, response, body) {
      if (!error) {
        res.render('top_artists', {
          path: 'top_artists',
          artists: body,
          user: req.cookies.spotify_user
        });
      } else {
        clearCookies(req, res);
        res.redirect('/?' +
          querystring.stringify({
            error: 'Please authenticate again.'
          }));
      }
    });
  }
});

router.get('/top_songs', (req, res, next) => {
  if (!req.cookies.access_token) {
    res.redirect('/login');
  } else {
    const getTopSongs = {
      url: 'https://api.spotify.com/v1/me/top/tracks?limit=50',
      headers: {
        'Authorization': 'Bearer ' + req.cookies.access_token
      },
      json: true
    };

    request.get(getTopSongs, function (error, response, body) {
      if (!error) {
        res.render('top_songs', {
          path: 'top_songs',
          tracks: body,
          user: req.cookies.spotify_user
        });
      } else {
        clearCookies(req, res);
        res.redirect('/?' +
          querystring.stringify({
            error: 'Please authenticate again.'
          }));
      }
    });
  }
});

router.get('/', (req, res, next) => {
  res.render('index', {
    path: 'index',
    error: req.query.error,
    success: req.query.success,
    user: req.cookies.spotify_user
  });
});

module.exports = router;
