const router = require("express").Router();
const passport = require("passport");

router.get("/signin", (req, res) => {
    try {
        return res.render("admin/signin", { layout: "admin/layout", pageTitle: "Login", req, res });
    } catch (err) {
        return res.redirect(303, "/");
    }
});

router.post('/signin', (req, res, next) => {
    passport.authenticate('admin-local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('error_msg', info.message || 'Login failed');
            return res.redirect('/admin/signin');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            // Explicitly save session
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                return res.redirect('/admin');
            });
        });
    })(req, res, next);
});

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/admin/signin');
    });
});



module.exports = router;