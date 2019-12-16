/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', routes.views.index);
	app.get('/blog/:category?', routes.views.blog);
	app.get('/blog/post/:post', routes.views.post);
	app.get('/gallery', routes.views.gallery);
	app.all('/contact', routes.views.contact);
	app.get('/tickets', routes.views.ticket.ticketlist );
	app.all('/createticket', middleware.requireUser, routes.views.ticket.newticket);
	app.get('/tickets/:slug', routes.views.ticket.singleticket);
	app.all('/signup', routes.views.auth.signup);
	//app.all('/signin', routes.views.auth.signin);
	//app.get('/signout', routes.views.auth.signout);
	//app.all('/forgotpassword',routes.views.auth.forgotpassword);
	//app.all('/resetpassword/:key', routes.views.auth.resetpassword);
	//app.all('/admin*', middleware.isAdmin);
	//app.get('/admin/*', [middleware.requireUser, middleware.logRequests]);
	//app.get('/admin/viewcontent', routes.views.viewcontent);
	//app.post('/admin/editcontent', routes.views.editcontent);
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
