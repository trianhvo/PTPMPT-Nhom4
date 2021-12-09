const { pictureSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Picture = require('./models/picture');
const Review = require('./models/review');
const User = require('./models/user');

module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'You must be signed in first!');
		return res.redirect('/login');
	}
	next();
};
module.exports.validatePicture = (req, res, next) => {
	const { error } = pictureSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const picture = await Picture.findById(id);
	if (!picture.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that!');
		return res.redirect(`/pictures/${id}`);
	}
	next();
};
module.exports.validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};
module.exports.isReviewAuthor = async (req, res, next) => {
	const { id, reviewId } = req.params;
	const review = await Review.findById(id);
	if (!review.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that!');
		return res.redirect(`/pictures/${id}`);
	}
	next();
};
module.exports.isAuthorProfile = async (req, res, next) => {
	const { id } = req.params;
	const user = await User.findById(id);
	if (!user.author.equals(req.user._id)) {
		req.flash('error', 'You do not have permission to do that!');
		return res.redirect(`/users/${id}`);
	}
	next();
};
