const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// 세션 설정
const session = require("express-session");
const sessionStore = require("./db/session");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const menuRouter = require('./routes/menu');
const detailRouter = require('./routes/menudetail');
const basketRouter = require('./routes/basket');
const orderRouter = require('./routes/order');
const adminRouter = require('./routes/admin');
const orderpageRouter = require('./routes/orderpage')
const ingriRouter = require('./routes/ingri');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session 미들웨어
app.use(session({
  secret : "sessionkey",
  resave : false,
  saveUninitialized:true,
  store: sessionStore
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/menu', menuRouter);
app.use('/menudetail', detailRouter);
app.use('/basket', basketRouter);
app.use('/order', orderRouter);
app.use('/admin', adminRouter);
app.use('/orderpage', orderpageRouter);
app.use('/ingri', ingriRouter);

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
