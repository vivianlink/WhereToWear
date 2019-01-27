var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var api_keys  = require('./api_keys.json');
var insta = require('./instagram');
var weather = require('./weather.js');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views/dist/views/')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use("/api/getCurrentWeather", function(req, res) {
    if (!req.query) {
        res.status(400);
        res.send("Invalid input");
        return;
    } else if (!req.query.lat) {
        res.status(400);
        res.send("Invalid input, no lat.");
        return;
    } else if (!req.query.lng) {
        res.status(400);
        res.send("Invalid input, no lng.");
        return;
    }

    weather.getCurrentWeather(req.query.lat, req.query.lng, function(error, data) {
        if (error) {
            res.status(500);
            console.log("error:", error.toString());
            res.send("Unknown error happened, check server logs");
            return;
        }

        res.status(200);
        res.json(data);
    });
});


app.use("/api/getWeatherOf", function(req, res) {

    if (!req.query) {
        res.status(400);
        res.send("Invalid input");
        return;
    } else if (!req.query.lat) {
        res.status(400);
        res.send("Invalid input, no lat.");
        return;
    } else if (!req.query.lng) {
        res.status(400);
        res.send("Invalid input, no lng.");
        return;
    } else if (!req.query.date) {
        res.status(400);
        res.send("Invalid input, no date.");
        return;
    }


    weather.getWeatherOf(req.query.lat, req.query.lng, parseInt(req.query.date), function(error, data) {
        if (error) {
            res.status(500);
            console.log("error:", error.toString());
            res.send("Unknown error happened, check server logs. OOPSIE WOOPSIE uWu. We made a fucky wucky!");
            return;
        }

        res.status(200);
        res.json(data);
    });
});

app.use("/api/getPhotos", function(req, res) {
    if (!req.query) {
      res.status(400);
      res.send("Invalid input");
      return;
    } else if (!req.query.lat) {
      res.status(400);
      res.send("Invalid input, no lat.");
      return;
    } else if (!req.query.lng) {
      res.status(400);
      res.send("Invalid input, no lng.");
      return;
    }

    insta.getPhotos(req.query.lat, req.query.lng).then(data => {
        res.status(200);
        res.json(data);
    }).catch(e => {
        res.status(500);
        res.send("OOPSIE WOOPSIE!! Uwu We made a fucky wucky!! A wittle fucko boingo! The code monkeys at our headquarters are working VEWY HAWD to fix this!")
    });


});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
