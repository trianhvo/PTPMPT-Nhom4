const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');

router
	.route('/register')
	.get(users.renderRegister)
	.post(catchAsync(users.register));

router
    .route('/login')
    .get(users.renderLogin)
    .post(
        passport.authenticate('local', {
            failureFlash: true,
            failureRedirect: '/login',
        }),
        users.login
    );

router.get('/logout', users.logout);

router.get('/users/:id', catchAsync(users.getInfo));

router.get('/users/:id/edit', catchAsync(users.renderEdit));

module.exports = router;