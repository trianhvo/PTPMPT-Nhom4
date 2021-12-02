const Picture = require('../models/picture');
const axios = require('axios');

module.exports.index = async(req, res) => {
    var noMatch = null;
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const pictures = await Picture.find({
            $or: [
                { title: regex },
                { location: regex },
                { 'author.username': regex },
            ],
        }); {
            if (pictures.length < 1) {
                var noMatch = req.query.search;
                console.log('ko thay anh');
            }
            res.render('pictures/index', { pictures, noMatch });
        }
    } else {
        const pictures = await Picture.find({});
        res.render('pictures/index', { pictures, noMatch });
    }
};

module.exports.renderNewForm = (req, res) => {
    res.render('pictures/new');
};

module.exports.createPicture = async(req, res, next) => {
    // const geoData = await axios.get(
    // 	`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
    // 		req.body.picture.location
    // 	)}&key=AIzaSyC5V1VkqoPbKIbRYnyqjpYzh9Arj87-abg`
    // );
    //const { lat, lng } = geoData.data.results[0].geometry.location;

    console.log(req.files);
    const picture = new Picture(req.body.picture);
    //picture.geometry = { lat, lng };
    picture.images = req.files.map((f) => ({
        url: '\\uploads\\' + f.filename,
        filename: f.filename,
    }));
    picture.author = req.user._id;
    await picture.save();
    console.log(picture);
    req.flash('success', 'Successfully upload a new picture!');
    res.redirect(`/pictures/${picture._id}`);
};

module.exports.showPicture = async(req, res) => {
    const picture = await Picture.findById(req.params.id)
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
    res.render('pictures/show', { picture });
};