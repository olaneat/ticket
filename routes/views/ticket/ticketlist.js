let keystone = require('keystone');
exports = module.exports = function(req, res) {
	let view = new keystone.View(req, res);
	let locals = res.locals;
	locals.section = 'tickets';
	locals.data = {
		ticket: []
	};

	view.on('init', function(next){
		let q = keystone.list('Ticket').paginate({
			page: req.query.page || 1,
			perPage: 5,
			maxPages: 5
		});
		
		q.exec(function(err, results){
			locals.data.ticket = results;
			next(err)
		});
	});
	view.render('tickets/ticketlist');
}