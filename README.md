# Spotify - Your top tracks

A quick nodeJS app that implements the Spotify Personalization API. By logging in to your Spotify account with OAth 2.0, the app gets an access token for your account and displays the top 50 most-listened tracks or artists in the past 6 months. The access token is not stored in a database, instead it is saved in the browser.

You can also listen to a quick 30 second preview of the track. If you use a Chromium-based browser (or as a matter of fact any browser) you can easily download the 30s preview and use it as a ringtone - but tell no one 🤫

## Instructions
* Create an app in https://developer.spotify.com/dashboard
* Get the Client ID and Client secret of the app you created
* Whitelist the Redirect URI in the settings of the app (for developement add http://lcalhost:3000/callback/)

#### Installation
* Clone repo, cd to folder
* Create a .env file based on example.env in the root directory
* run ```npm install```
* run ```npm start```

