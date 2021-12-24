const Picture = require('../models/picture');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
	const picture = await Picture.findById(req.params.id);
	const review = new Review(req.body.review);
	review.author = req.user._id;
	picture.reviews.push(review);
	await review.save();
	await picture.save();
	req.flash('success', 'Upload thanh cong binh luan');
	res.redirect(`/pictures/${picture._id}`);
};

module.exports.deleteReview = async (req, res) => {
	const { id, reviewId } = req.params;
	await Picture.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
	await Review.findByIdAndDelete(reviewId);
	req.flash('success', 'Xoa thanh cong review');
	res.redirect(`/pictures/${id}`);
};
