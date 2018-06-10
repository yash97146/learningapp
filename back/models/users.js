var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var validate = require('mongoose-validator');

var NameValidator = [
	validate({
	  validator: 'matches',
	  arguments: /^[a-zA-Z]+$/i,
	})
];

var EmailValidator = [
	validate({
	  validator: 'isEmail',
	  message: 'please provide correct email address'
	})
];

var UserValidator = [
	validate({
	  validator: 'isAlphanumeric',
	  message: 'please provide correct username'
	})	
];

var UserSchema = new Schema({
	email: { type: String, lowercase: true, required: true, unique: true, validate: EmailValidator},
	username: { type: String, required: true},
	password: { type: String, required: true},
	name: {type: String, required: true, validate: NameValidator},
	active : { type: Boolean, required: true, default: false},
	emailtoken: { type:String, required: true }
});

UserSchema.pre('save',function (next) {
	var user = this;
	bcrypt.hash(user.password,null,null,function(err,hash){
		if (err) return next(err);
		user.password = hash;
		next();
	});
});

UserSchema.methods.compare = function(password){
	return bcrypt.compareSync(password,this.password);
}

module.exports = mongoose.model('User',UserSchema);