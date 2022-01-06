const Picture = require('../models/picture');
const moment = require('moment');
const axios = require('axios');

module.exports.index = async (req, res) => {
	var noMatch = null;
	let pictures;
	if (req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		pictures = await Picture.find({
			$or: [
				{ title: regex },
				{ location: regex },
				{ 'author.username': regex },
			],
		})
			.sort({ createAt: -1 })
			.limit(10)
			.skip(0)
			.populate('author')
			.populate('reviews');
		if (pictures.length < 1) {
			noMatch = req.query.search;
			console.log('ko thay anh');
		}
	} else {
		pictures = await Picture.find({})
			.sort({ createAt: -1 })
			.limit(10)
			.skip(0)
			.populate('author')
			.populate('reviews');
	}
	pictures = pictures.map((x) => {
		x = x.toObject();
		let total = x.reviews.map((x) => x.rating);
		total = total.reduce((a, b) => a + b, 0);
		let len = x.reviews.length;
		let mean = total ? total / len : 0;
		x.reviews = { mean: mean.toFixed(1), len };
		return x;
	});
	res.render('pictures/index', { pictures, noMatch });
};

module.exports.renderNewForm = (req, res) => {
	res.render('pictures/new');
};

module.exports.createPicture = async (req, res, next) => {
	const geoData = await axios.get(
		`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
			req.body.picture.location
		)}&key=AIzaSyBaJix9e7zSmV_qsDOWnRxcap-uAVcc86E`
	);
	console.log(geoData.data);
	const { lat, lng } = geoData.data.results[0].geometry.location;

	const picture = new Picture(req.body.picture);
	picture.geometry = { lat, lng };
	picture.images = req.files.map((f) => ({
		url: 'data:image/png;base64,' + f.buffer.toString('base64'),
		filename: Math.round(Math.random() * 1e9),
	}));
	picture.author = req.user._id;
	picture.createAt = Date.now();
	await picture.save();
	req.flash('success', 'Successfully upload a new picture!');
	res.redirect(`/pictures/${picture._id}`);
};

module.exports.showPicture = async (req, res) => {
	let picture = await Picture.findById(req.params.id)
		.populate({
			path: 'reviews',
			populate: {
				path: 'author',
			},
		})
		.populate('author');
	if (!picture) {
		req.flash('error', 'Cannot find that picture!');
		return res.redirect('/pictures');
	}

	picture = picture.toObject();
	picture.createAt = moment(picture.createAt).fromNow();

	res.render('pictures/show', { picture });
};

module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params;
	const picture = await Picture.findById(id);
	if (!picture) {
		req.flash('error', 'Cannot find that picture!');
		return res.redirect('/pictures');
	}
	res.render('pictures/edit', { picture });
};

module.exports.updatePicture = async (req, res) => {
	const { id } = req.params;
	const picture = await Picture.findByIdAndUpdate(id, { ...req.body.picture });
	const imgs = req.files.map((f) => ({
		url: 'data:image/png;base64,' + f.buffer.toString('base64'),
		filename: Math.round(Math.random() * 1e9),
	}));
	picture.images.push(...imgs);
	await picture.save();
	if (req.body.deleteImages) {
		await picture.updateOne({
			$pull: { images: { filename: { $in: req.body.deleteImages } } },
		});
	}
	req.flash('success', 'Successfully updated picture!');
	res.redirect(`/pictures/${picture._id}`);
};

module.exports.deletePicture = async (req, res) => {
	const { id } = req.params;
	await Picture.findByIdAndDelete(id);
	req.flash('success', 'Successfully deleted picture');
	res.redirect('/pictures');
};

module.exports.getPosts = async (req, res) => {
	let noMatch = null;
	let pictures;
	let { search, limit, skip, uid } = req.query;
	limit = parseInt(limit);
	skip = parseInt(skip);
	if (uid) {
		pictures = await Picture.find({ author: uid })
			.sort({ createAt: -1 })
			.limit(limit)
			.skip(skip)
			.populate('author')
			.populate('reviews');
	}
	if (search) {
		const regex = new RegExp(escapeRegex(search), 'gi');
		pictures = await Picture.find({
			$or: [
				{ title: regex },
				{ location: regex },
				{ 'author.username': regex },
			],
		})
			.sort({ createAt: -1 })
			.limit(limit)
			.skip(skip)
			.populate('author')
			.populate('reviews');
	}
	if (!search && !uid) {
		pictures = await Picture.find({})
			.sort({ createAt: -1 })
			.limit(limit)
			.skip(skip)
			.populate('author')
			.populate('reviews');
	}
	if (pictures.length < 1) {
		noMatch = search;
		return res.status(400).json({ msg: 'đã load hết ảnh' });
	}
	pictures = pictures.map((x) => {
		x = x.toObject();
		let total = x.reviews.map((x) => x.rating);
		total = total.reduce((a, b) => a + b, 0);
		let len = x.reviews.length;
		let mean = total ? total / len : 0;
		x.reviews = { mean: mean.toFixed(1), len };
		return x;
	});
	res.json(pictures);
};

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
