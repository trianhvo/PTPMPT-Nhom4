const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PictureSchema = new Schema({
	title: String,
	price: Number,
	description: String,

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
