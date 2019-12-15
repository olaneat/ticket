let keystone = require('keystone');
exports = module.exports = function(req, res) {
	let view = new keystone.View(req, res);
	let locals = res.locals;
	locals.section = 'tickets';
	locals.data = {
		ticket: []
	};
	view.on('init', function(next){
		let k = keystone.list('Ticket').model.findOne({slug:req.params.slug});
		k.exec(function(err, result){
			if (result != null) {
				locals.data.ticket = result;
			}
			else{
				return res.status(404).send(keystone.wrapHTMLError('sorry no record found, (404)'));
			}
			next(err)
		});
	});
	view.render('tickets/singleticket');
}