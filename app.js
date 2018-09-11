var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');


var app = express();
app.locals.pretty = true;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/scripts', express.static(__dirname + '/node_modules/vue/dist'));
app.use('/scripts', express.static(__dirname + '/node_modules/vuetify/dist'));
app.use('/styles', express.static(__dirname + '/node_modules/vuetify/dist'));
app.use('/scripts', express.static(__dirname + '/node_modules/axios/dist'));
app.use('/scripts', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/scripts', express.static(__dirname + '/node_modules/viewerjs/dist'));
app.use('/styles', express.static(__dirname + '/node_modules/viewerjs/dist'));
app.use('/scripts', express.static(__dirname + '/node_modules/vue-fullpage.js/dist'));
app.use('/scripts', express.static(__dirname + '/node_modules/quill/dist'));
app.use('/styles', express.static(__dirname + '/node_modules/quill/dist'));
app.use('/scripts', express.static(__dirname + '/node_modules/vue-quill-editor/dist'));
app.use('/scripts', express.static(__dirname + '/node_modules/mxgraph/javascript'));
app.use('/scripts', express.static(__dirname + '/node_modules/gojs/release'));
app.use('/scripts', express.static(__dirname + '/node_modules/interactjs/dist'));

var indexRouter = require('./routes/index');
var boardRouter = require('./routes/board');
var usersRouter = require('./routes/users');
var auth = require('./routes/auth')(app);

app.use('/', indexRouter);
app.use('/auth', auth);
app.use('/users', usersRouter);
app.use('/board', boardRouter);

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
