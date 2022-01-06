const User = require('../models/user');
const Picture = require('../models/picture');

module.exports.renderRegister = (req, res) => {
	res.render('users/register');
};

module.exports.register = async (req, res, next) => {
	try {
		const { firstName, lastName, email, username, password } = req.body;
		const user = new User({ firstName, lastName, email, username });
		const registeredUser = await User.register(user, password);
		console.log(registeredUser);
		req.login(registeredUser, (err) => {
			if (err) return next(err);
			req.flash('success', 'Welcome to ImageShare!');
			res.redirect('/pictures');
		});
	} catch (e) {
		req.flash('error', e.message);
		res.redirect('register');
	}
};

module.exports.renderLogin = (req, res) => {
	res.render('users/login');
};

module.exports.login = (req, res) => {
	req.flash('success', 'Welcome Back!');
	const redirectUrl = req.session.returnTo || '/pictures';
	delete req.session.returnTo;
	res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
	req.logout();
	req.flash('success', 'Goodbye!');
	res.redirect('/pictures');
};

module.exports.getInfo = async (req, res) => {
	const user = await User.findById(req.params.id);
	let pictures = await Picture.find({ author: req.params.id })
		.sort({ createAt: -1 })
		.limit(10)
		.skip(0)
		.populate('author')
		.populate('reviews');
	pictures = pictures.map((x) => {
		x = x.toObject();
		let total = x.reviews.map((x) => x.rating);
		total = total.reduce((a, b) => a + b, 0);
		let len = x.reviews.length;
		let mean = total ? total / len : 0;
		x.reviews = { mean: mean.toFixed(1), len };
		return x;
	});
	res.render('users/show', { user, pictures });
};

module.exports.renderEdit = async (req, res) => {
	const user = await User.findById(req.params.id);
	// res.render('users/edit', { user });
	if (!user) {
		req.flash('error', 'Cannot find that user!');
	}
	res.render('users/edit', { user });
};

module.exports.update = async (req, res) => {
	const { id } = req.params;
	if (req.body.avatar) req.body.user.avatar = req.body.avatar;
	await User.findByIdAndUpdate(id, { ...req.body.user });
	if (req.file) {
		req.body.user.avatar =
			'data:image/png;base64,' + req.file.buffer.toString('base64');
	}
	await User.findByIdAndUpdate(id, { ...req.body.user });
	req.flash('success', 'Successfully updated profile!');
	res.redirect(`/users/${req.user._id}`);
};
