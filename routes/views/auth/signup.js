let keystone = require('keystone'),
	async = require('async');

exports = module.exports = function(req, res) {
	if (req.user) {
		return res.redirect('/tickets');
	}
	let view = new keystone.View(req, res),
		locals = req.locals;
	locals.section  = 'createacctount';
	locals.form = req.body;
	view.on('post', function(next) {
		async.series([
			function(cb) {
				if (!req.body.username || !req.body.firstname || !req.body.surname
					|| !req.body.email || !req.body.password || !req.body.confirmPassword) {
					req.flash('error', 'invalid Details, kindly cross check your details')
				return cb(true)
				} 

				return cb()

				if (req.body.password !== req.body.confirmPassword ) {
					req.flash('password didn\'t match, kidly try again')
					return cb(true)
				}
				return cb()
			},
			function(cb) {
				keystone.list('User').model.findOne({username: req.body.username},function (err, user) {
					if(err || user) {
						req.flash('sorry, username already exists' )
					return cb(true)
					}
					return cb()
				});
				
			},
			function(cb) {
				keystone.list('User').model.findOne({email: req.body.email},function(err, user) {
					if (err || user) {
							req.flash('error, email already exists')
					return cb(true)
					}
					return cb();
				});
				
			},

			function (cb) {
				let userDate = {
					username: req.body.username,
					name: {
						firstname: req.body.firstname,
						lastname: req.body.lastname,
					},
					email: req.body.email,
					password: req.body.password,
					confirmPassword: req.body.confirmPassword,
				};
					let User = keystone.list('User').model,
					newUser = new User(userDate);
					newUser.save(function(err) {
						return cb(err)
					});
				}
			
			],function(err) {
				if (err) return next();
				let onSuccess = function() {
					res.redirect('/tickets')
				}
				let onFail =function(e) {
				req.flash('error, creating account, kindly try again')
				return next()
				}
				keystone.session.signin({email:req.body.email, password:req.body.password}, req, res, 
				 onFail, onSuccess)
			});
	});
	view.render('auth/signup')
}