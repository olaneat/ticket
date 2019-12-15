let keystone = require('keystone');
let Types = keystone.Field.Types;

let Product = new keystone.List('Product');

Product.add({
	title:{type:String,require:true, initial:true},
	team:{type:String},
	status:{type:Types.Select, options: 'Draft, Published', default: 'Draft'},
	createdBy:{type:Types.Relationship, ref : 'User' },
	created:{type: Types.Datetime, default:Date.now}
})

Product.schema.virtual('fulltitle').get(function() {
	this.title + ' ' + this.team;
})
Product.register()