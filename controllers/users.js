const User = require('../models/user');

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

	res.render('users/show', { user });
};

module.exports.renderEdit = async (req, res) => {
	const user = await User.findById(req.params.id);
	// res.render('users/edit', { user });
	if (!user) {
		req.flash('error', 'Cannot find that user!');
	}
	res.render('users/edit', { user });
};