if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
  
const express = require('express');
const bodyParser = require('body-parser');
const routes = require("./routes/routes.js");
const cors = require('cors');
const cookieParser = require('cookie-parser');

const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(cookieParser());

app.use(routes);

app.use((req, res, next) => {
    res.status(404).send('<h1>Page not found</h1>');
});

app.listen(3000);