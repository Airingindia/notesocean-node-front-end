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
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
// express
var express = require('express'),
  app = express(),
  session = require('express-session'),
  lusca = require('lusca');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// application secuity

// rate limit
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 50, // Limit each IP to 100 requests per `window` (here, per 1 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: true, // Disable the `X-RateLimit-*` headers
})

// Apply the rate limiting middleware to all requests
app.use(limiter);

// app.use(session({
//   secret: 'notesoceansecurecookie',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true }

// }));


// app.use(lusca({
//   csrf: true,
//   xframe: 'SAMEORIGIN',
//   hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
//   xssProtection: true,
//   nosniff: true,
//   referrerPolicy: 'same-origin',
// }));

app.disable('x-powered-by');

// data dog

var dd_options = {
  'response_code': true,
  'tags': ['app:my_app']
}
var connect_datadog = require('connect-datadog')(dd_options);
app.use(connect_datadog);

//  middleware
// app.use(logger('dev'));
app.use(function (req, res, next) {
  if (req.hostname == "localhost") {
    var api = process.env.LOCAL_API_URL;
  } else if (req.hostname == "dev.notesocean.com") {
    var api = process.env.DEV_API_URL;
  } else if (req.hostname == "notesocean.com") {
    var api = process.env.PROD_API_URL;
  } else {
    return res.render("error/500");
  }
  res.cookie("api", Buffer.from(api).toString('base64'));
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(helmet.frameguard())


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


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404);
  res.render("notfound");
  next();
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err);
  res.render("errors/500");
});

module.exports = app;
