let keystone = require('keystone');
exports = module.exports = function(req, res) {
	let view = new keystone.View(req, res)
	let locals = res.locals;
	locals.forms =req.body;
	locals.data= {
		users: [],
	};
	view.on('init', function(next) {
		let k = keystone.list('User').model.find.select('_id\
			username');
		k.exec(function(err, results){
			locals.data.users = results;
			next(err);
		});
	});

	view.on('post', function(next) {
		let newTicket = new Ticket.model();
		data = req.body;
		data.createdBy = req.locals.user.id;
		newTicket.getUpdateHandler(req).process(data,{
			flashError : true
		}, function(err) {
			if (err) {
				locals.validationError = err.errors;
			}else{
				req.flash('sucess', 'Ticket successfully created');
				return res.redirect('/ticket/' + newTicket.slug)
			}
			next()
		});

	});
	view.render('ticket/newticket')

}