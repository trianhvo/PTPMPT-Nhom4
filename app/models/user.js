const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
	username: String,
	password: String,
	avatar: {
		type: String,
		default: 'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png',
	},
	firstName: String,
	lastName: String,
	bio: { type: String, default: 'This is where you can write about yourself' },
	email: {
		type: String,
		required: true,
		unique: true,
	},
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
