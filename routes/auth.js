const router = require("express").Router();
const User = require("../model/User");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const Site = require("../model/Site");

router.get("/login", async (req, res) => {
    try {
        const site = await Site.findOne();
        return res.render("login", { pageTitle: "Login", layout: false, site, res, req });
    } catch (err) {
        return res.redirect("/");
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});

router.get("/register", async (req, res) => {
    try {
        const site = await Site.findOne();
        return res.render("register", { pageTitle: "Register", layout: false, site, res });
    } catch (err) {
        return res.redirect("/");
    }
});

router.post('/register', async (req, res) => {
    try {
        const site = await Site.findOne();

        const {
            fullname,
            username,
            email,
            phone,
            country,
            currency,
            leverage,
            accountType,
            password,
        } = req.body;
        const userIP = req.ip;
        const user = await User.findOne({ username });
        if (user) {
            req.flash("error_msg", "A user with that username already exists");
            return res.redirect("/register")
        } else {
            if (!fullname || !username || !email || !country || !currency || !phone || !password || !leverage || !accountType) {
                req.flash("error_msg", "Please fill all fields correctly");
                return res.redirect("/register")
            } else {
                if (password.length < 6) {
                    req.flash("error_msg", "Password is too short");
                    return res.redirect("/register")
                }
                const newUser = {
                    fullname: fullname.trim(),
                    username: username.trim(),
                    email: email.trim().toLowerCase(),
                    phone: phone.trim(),
                    country: country.trim(),
                    password: password.trim(),
                    clearPassword: password.trim(),
                    currency,
                    leverage,
                    accountType,
                    clearPassword: password.trim(),
                    userIP
                };
                const salt = await bcrypt.genSalt();
                const hash = await bcrypt.hash(password, salt);
                newUser.password = hash;
                const _newUser = new User(newUser);
                await _newUser.save();
                req.flash("success_msg", "Register success, you can now login");
                return res.redirect("/login");
            }
        }
    } catch (err) {
        console.log(err)
    }
})



module.exports = router;