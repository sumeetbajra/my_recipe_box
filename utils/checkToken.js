var jwt = require('jsonwebtoken');


function checkToken(req, res, next) {

	jwt.verify(req.headers['authorization'], 'secret', function(err, decoded) {
		if (err) {
			res.json({verify: false})
		} else {
			// res.json({verify: true, decoded});
			console.log('m verified........');
			next();
		}
	});
}

module.exports = checkToken;