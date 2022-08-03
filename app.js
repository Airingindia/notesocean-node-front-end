// import all libs
const compression = require('compression')
const express = require('express');
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
require("dotenv").config();
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
var dd_options = {
  'response_code': true,
  'tags': ['app:my_app']
}
var connect_datadog = require('connect-datadog')(dd_options);
app.use(connect_datadog);
app.use(logger('dev'));
app.use(function (req, res, next) {
  res.cookie("api", Buffer.from(process.env.API_URL).toString('base64'));
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());

app.use((req, res, next) => {
  const tomiliseconds = (hrs, min, sec) => (hrs * 60 * 60 + min * 60 + sec) * 1000;
  res.setHeader('Cache-Control', 'public, max-age=' + tomiliseconds(24, 0, 0));
  next();
});


// routing defined
app.use('/', indexRouter);
app.use('/account', accountRoutes);
app.use("/loginHandler", loginHandlerRoutes);
app.use("/api", apiRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/about", aboutRoutes);
app.use("/about-us", aboutRoutes);
app.use("/sitemaps", sitemapRoutes);
app.use("/notes/request", requesRoutes);
app.use("/notes", notesRoutes);
app.use("/contact", contactRoutes);
app.use("/contact-us", contactRoutes);
app.use("/courses", coursesRoute);
app.use("/subjects", subjectRoutes);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404);
  res.render("notfound");
  next();
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err);
});

module.exports = app;
