let keystone = require('keystone');
let async = require('async');

exports = module.exports = function(req, res) {
	if (req.user) {
		return res.redirect('/tickets')
	}
	let view = new keystone.View(req, res);
	let locals = res.locals;
	locals.section = 'createaccount'
	locals.form = 'body';

	view.on('post', function(next) {
		async.series([
			function(cb) {
				if (!req.body.username || !req.body.firstname || !req.body.lastname
					|| !req.body.password || !req.body.email) {
					req.flash('error', 'kindly check your form for error');
				return cb(true)
				}
				return cb();
			},

			function(cb) {
				keystone.list('User').model.findOne({username: req.body.username}, function(err, user) {
					if (err || user) {
						return req.flash('error', 'username already taken')
						return cb(true);
					}
					return cb()
				});
			},
			function (cb) {
				keystone.list('User').model.findOne({email: req.body.email}, function(user, err) {
					if (err || user) {
						return req.flash('error', 'email already exists')
						return cb(true);
					}
					return cb()
				});		
			},

			function(cb) {
				let userData = {
					username: req.body.username,
					name: {
						firstname : req.body.firstname,
						lastname : req.body.lastname,
					},
					email : req.body.email,
					confirmPassword: req.body.confirmPassword,
					password: req.body.password,
				};
				
				let newUser = new User('userData');
				newUser.save(function(err) {
					return cb(err);
				}); 
			}
		], function (err) {
			if (err) return next();
			let onSuccess = function() {
			res.redirect('/tickets')
			}
			let failure = function (e) {
				req.flash('error', 'there was an error  creating user')
				return next()
			}
			keystone.session.signin({email: req.body.email, password:req.body.password}, req, res,onSuccess, failure);
		});
	});
	view.render('auth/signup')
}