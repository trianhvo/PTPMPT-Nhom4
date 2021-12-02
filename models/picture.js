const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
	url: String,
	filename: String,
});

const PictureSchema = new Schema({
	title: String,
	images: [ImageSchema],
	geometry: {
		lat: {
			type: Number,
			required: false,
		},
		lng: {
			type: Number,
			required: false,
		},
	},
	price: Number,
	description: String,
	location: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
});
PictureSchema.post('findOneAndDelete', async function (doc) {
	if (doc) {
		await Review.deleteMany({
			_id: {
				$in: doc.reviews,
			},
		});
	}
});

module.exports = mongoose.model('Picture', PictureSchema);