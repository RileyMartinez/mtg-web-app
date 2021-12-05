var express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('users');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

router.post('/register', async (req, res, next) => {
  try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, err => {
          if (err) return next(err);
          res.redirect('/');
      })
  } catch (e) {
      res.redirect('/users/register');
      console.log(e);
  }
});

router.get('/login', (req, res) => {
  res.render('login');
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login' }), (req, res) => {
  const redirectUrl = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
})

module.exports = router;
