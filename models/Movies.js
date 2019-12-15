let keystone = require('keystone');
let Types = keystone.Field.Types;

let Ticket = new keystone.List('Ticket', {
	autokey: {from: 'title', path: 'slug', unique : true },
	searchFields: 'title, category, assignedTo, description'
});
Ticket.add({
	title:{type: String, initial: true, default: '', required: true},
	description:{type:Types.Textarea},
	category:{type:Types.Select, options: 'Bug, Feature, Enhancement', default: 'Bug'},
	status: {type:Types.Select, options: 'New, In Progress, Open, On Hold', default: 'Open'},
	priority: {type:Types.Select, options: 'High, Low, Decline, Closed Medium', default: 'Medium'},
	createdBy: { type: Types.Relationship, ref: 'User', index: true, many:false, filters: {isAdmin: true}},
	assignedTo: {type: Types.Relationship, ref: 'User', many:false, index: true},
	created: {type: Types.Datetime, default: Date.now},
	Updated: {type: Types.Datetime, default: Date.now},
	tags: {type: Types.Relationship, ref: 'Tag', many:true}

})
Ticket.defaultColumns = 'title| 20%, status|15%, assignedTo, createdBy, created';
Ticket.defaultSort = '-created';

Ticket.schema.virtual('url').get(function(){
	return '/tickets/' + this.slug ;
})
Ticket.register()