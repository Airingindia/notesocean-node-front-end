const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index.routes');
const accountRoutes = require('./routes/account.routes');
const loginHandlerRoutes = require("./routes/loginHandler.routes");
const apiEnvRoutes = require('./routes/api.env.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/account', accountRoutes);
app.use("/loginHandler", loginHandlerRoutes);
app.use("/api/env", apiEnvRoutes);
app.use("/dashboard", dashboardRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err.message);
  // res.sendFile(path.join(__dirname, './views/index.html'));
});

module.exports = app;
