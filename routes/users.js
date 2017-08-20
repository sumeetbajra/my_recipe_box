var express = require('express');
var router = express.Router();

var Users = require('../models/users');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/login', function(req, res) {
  res.render('login');
});
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


router.post('/register', function(req, res) {

	const saltRounds = 10;
	const myPlaintextPassword = req.body.password;

	bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
		var user = new Users({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			address: req.body.address,
			email: req.body.email,
			password: hash,

		});
		user.save(function(err, doc) {
			if(err) throw err
			res.json({register: true, doc});
		});
		console.log('entered..........', user);
	});

});

router.post('/login', function(req, res) {

	if(req.body.email && req.body.password) {
		Users.find({email: req.body.email}, function(err, docs) {
			if(err) {
				res.json({successs: false, message: 'Error'});
			}
			bcrypt.compare(req.body.password, docs[0].password, function(err, loginSuccess) {
				console.log(',,,,,,,,,,,,,,,,,,,,', docs[0]);
				if(loginSuccess) {
					var token = jwt.sign(docs[0], 'secret', { expiresIn: 60 * 60 });
					res.json({successs: true, result: {message: 'Login Successful!', token, user: docs[0]}});
				} else {
					res.json({successs: false, result: {message: 'User not found'}})
				}
			});
		});
    }
});

// router.post('/verify', function(req, res) {
// 	jwt.verify(req.headers['authorization'], 'secret', function(err, decoded) {
// 		if (err) {
// 			res.json({verify: false})
// 		} else {
// 			res.json({verify: true, decoded})
// 		}
// 	})
// })

module.exports = router;
