let keystone = require('keystone');
let Types = keystone.Field.Types;

let Tag = new keystone.List('Tag',{
	autokey: {from: 'name', path: 'slug', unique: true}
});
Tag.add({
	name: {type:String, required: true}

})
Tag.relationship({ref: 'Ticket', refpath: 'tickettags', path:'ticket'})
Tag.register()