const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser') ;
const app = express();

const contest = require('./Routes/contest');


app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use("/contest",contest);





app.use((req,res,next) => {
  const error = new Error("NOT FOUND") ;
  error.status = 404;
  next(error);
});


app.use((error,req,res,next) => {
  res.status(error.status || 500).json({
      message : error.message,
  });
});


module.exports = app ;