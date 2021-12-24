const express = require('express');
const router = express.Router();
const pictures = require('../controllers/pictures');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validatePicture } = require('../middleware');
const multer = require('multer');

const upload = multer({});

router
	.route('/')
	.get(catchAsync(pictures.index))
	.post(
		isLoggedIn,
		upload.array('image'),
		validatePicture,
		catchAsync(pictures.createPicture)
	);

router.get('/new', isLoggedIn, pictures.renderNewForm);

router
	.route('/:id')
	.get(catchAsync(pictures.showPicture))
	.put(
		isLoggedIn,
		isAuthor,
		upload.array('image'),
		validatePicture,
		catchAsync(pictures.updatePicture)
	)
	.delete(isLoggedIn, isAuthor, catchAsync(pictures.deletePicture));

router.get('/:id/edit', isLoggedIn, catchAsync(pictures.renderEditForm));

module.exports = router;
