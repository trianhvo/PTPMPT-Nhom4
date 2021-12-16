const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Picture = require('../models/picture');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');

const { reviewSchema } = require('../schemas.js');

// const validateReview = (req, res, next) => {
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete(
	'/:reviewId',
	isLoggedIn,
	isReviewAuthor,
	catchAsync(reviews.deleteReview)
);

module.exports = router;
