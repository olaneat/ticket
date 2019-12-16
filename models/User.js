var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User', {
	autokey: {from: 'username', path: 'slug', unique: true  }
});


User.add({
	username: {type: String, unique: true, required: true, index: true, default: ''},
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	resetPasswordKey: {type: String, hidden: true}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
	
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});
User.schema.virtual('url').get(function() {
	return '/users'+this.slug;
})


/**
 * Relationships
 */
User.relationship({ref: 'Ticket', path: 'tickets', refpath: 'createdBy'})
User.relationship({ref: 'Post', path: 'posts', refPath: 'author' });


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
