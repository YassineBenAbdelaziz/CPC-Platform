const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

const contest = require('./Routes/contest');
const problem = require('./Routes/problem');
const example = require('./Routes/example');
const submission = require('./Routes/submission');
const tag = require('./Routes/tag');
const user = require('./Routes/user');
const passport = require('passport');
const session = require('express-session');
const RedisStore = require("connect-redis").default
const { createClient } = require('redis');


/*
* ---------------- Redis Store SETUP ----------------
*/

let redisClient = createClient();
redisClient.connect().catch(console.error);

let redisStore = new RedisStore({
  client: redisClient,
});



/*
* ---------------- SESSION SETUP ----------------
*/

app.use(session({
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: false,
  store: redisStore,
}));


/*
* ---------------- Passport Init ----------------
*/

require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());




/*
* ---------------- Cors, bodyParser ... ----------------
*/



app.use(morgan('dev'));
app.use(cors({
  origin: [process.env.React_Url],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
}));
app.use('/uploads', express.static('./uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/*
* ---------------- Routes ----------------
*/


app.use("/contest", contest);
app.use('/problem', problem);
app.use('/example', example);
app.use('/submission', submission);
app.use('/tag', tag);
app.use('/user', user);


/*
* ---------------- Error Handler ----------------
*/

app.use((req, res, next) => {
  const error = new Error("NOT FOUND");
  error.status = 404;
  next(error);
});


app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message,
  });
});


module.exports = app;