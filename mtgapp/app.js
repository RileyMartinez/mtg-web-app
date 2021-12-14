var dotenv = require('dotenv');
var dotenvExpand = require('dotenv-expand');

var myEnv = dotenv.config();
dotenvExpand(myEnv);

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/user');
var fs = require('fs');

var indexRouter = require('./routes/index');
var aboutRouter = require('./routes/about');
var workRouter = require('./routes/work');
var contactRouter = require('./routes/contact');
var usersRouter = require('./routes/users');

var app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sessionConfig = {
  secret: process.env.KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    next();
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// setup static resources
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public/stylesheets')));
app.use('/js', express.static(path.join(__dirname, 'public/javascripts')));
app.use('/img', express.static(path.join(__dirname, 'public/images')));
app.use('/video', express.static(path.join(__dirname, 'public/video')));
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));

// setup routers
app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/work', workRouter);
app.use('/contact', contactRouter);
app.use('/users', usersRouter);

var feedbackDataFile = './public/feedbackData.json';
// Write feedback from to json file
app.post('/contact/feedback', function(req, res) {
    // Get form data
    let email = req.body.email;
    let feedback = req.body.textArea;
    let formObj = { email: email , feedback: feedback }

    // Read the existing file
    fs.readFile(feedbackDataFile, (err, data) => {
      if (err && err.code === "ENOENT") {
          // But the file might not yet exist.  If so, just write the object and bail
          return fs.writeFile(feedbackDataFile, JSON.stringify([formObj]), error => console.error);
      }
      else if (err) {
          // Some other error
          console.error(err);
      }    
      // Otherwise, get its JSON content
      else {
          try {
              const fileData = JSON.parse(data);

              // 3. Append the object you want
              fileData.push(formObj);

              //4. Write the file back out
              return fs.writeFile(feedbackDataFile, JSON.stringify(fileData), error => console.error)
          } catch(exception) {
              console.error(exception);
          }
      }
    });
    res.redirect('/contact');
}); 

app.post('/work/win', (req, res) => {
  User.findOneAndUpdate({ id: res.locals.currentUser.id }, { $inc: { wins: 1 } }, function(err, user) {
    if (err) throw err;
    console.log(user);
  });

  res.redirect('/work');
});

app.post('/work/loss', (req, res) => {
  User.findOneAndUpdate({ id: res.locals.currentUser.id }, { $inc: { losses: 1 } }, function(err, user) {
    if (err) throw err;
    console.log(user);
  });

  res.redirect('/work');
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
