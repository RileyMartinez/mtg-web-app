var express = require('express');
var router = express.Router();
var fs = require('fs');

checkAuthenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.username.toLowerCase() == "admin") { return next(); }
  res.redirect("/users/login");
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

router.get('/feedback', checkAuthenticatedAdmin, function(req, res, next) {
  var feedbackData = JSON.parse(fs.readFileSync('./public/feedbackData.json', 'utf8'));
  res.render('feedback', {title: 'Feedback', feedbackData:  JSON.stringify(feedbackData)});
});

module.exports = router;