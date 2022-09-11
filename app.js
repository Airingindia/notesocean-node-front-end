// import all libs
require("dotenv").config();
const compression = require('compression')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index.routes');
const accountRoutes = require('./routes/account.routes');
const loginHandlerRoutes = require("./routes/loginHandler.routes");
const apiRoutes = require('./routes/api.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const aboutRoutes = require('./routes/about.routes');
const contactRoutes = require("./routes/contact.routes");
const sitemapRoutes = require("./routes/sitemap.routes");
const coursesRoute = require("./routes/courses.routes");
const subjectRoutes = require("./routes/subjects.routes");
const notesRoutes = require("./routes/notes.routes");
const requesRoutes = require("./routes/request.routes");
const policiesRoutes = require("./routes/policies.routes");
const reportRoutes = require("./routes/report.routes");
const helmet = require('helmet');
// express
var express = require('express');
const app = express();

// view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.disable('x-powered-by');
var dd_options = {
  'response_code': true,
  'tags': ['app:my_app']
}

var connect_datadog = require('connect-datadog')(dd_options);
app.use(connect_datadog);

app.use(function (req, res, next) {
  var api = process.env.API_URL;
  res.cookie("api", Buffer.from(api).toString('base64'));
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(helmet.frameguard())
// routess

app.use('/', indexRouter);
app.use('/account', accountRoutes);
app.use("/loginHandler", loginHandlerRoutes);
app.use("/api", apiRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/about", aboutRoutes);
app.use("/about-us", aboutRoutes);
app.use("/sitemaps", sitemapRoutes);
app.use("/request", requesRoutes);
app.use("/notes", notesRoutes);
app.use("/contact", contactRoutes);
app.use("/contact-us", contactRoutes);
app.use("/courses", coursesRoute);
app.use("/subjects", subjectRoutes);
app.use("/policies", policiesRoutes);
app.use("/report", reportRoutes);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404);
  res.render("notfound");
  next();
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500);
  res.render("errors/500");
  next();
});

module.exports = app;
