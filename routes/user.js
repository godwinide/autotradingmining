const router = require("express").Router();
const { ensureAuthenticated } = require("../config/auth");
const User = require("../model/User");
const History = require("../model/History");
const comma = require("../utils/comma");
const uuid = require("uuid");
const Withdraw = require("../model/Withdraw");
const checkVerification = require("../config/verify");
const Site = require("../model/Site");

router.get("/dashboard", ensureAuthenticated, checkVerification, async (req, res) => {
    try {
        const site = await Site.findOne();
        return res.render("dashboard", { res, pageTitle: "Dashboard", site, req, comma, layout: "layout3" });
    } catch (err) {
        return res.redirect("/dashboard");
    }
});

router.get("/deposit", ensureAuthenticated, checkVerification, async (req, res) => {
    try {
        return res.render("deposit", { res, pageTitle: "Deposit", req, comma, layout: "layout3" });
    } catch (err) {
        return res.redirect("/dashboard");
    }
});

router.post("/deposit", ensureAuthenticated, checkVerification, async (req, res) => {
    try {
        return res.render("deposit", { res, pageTitle: "Deposit", req, comma, layout: "layout3" });
    } catch (err) {
        return res.redirect("/dashboard");
    }
});

router.get("/withdraw", ensureAuthenticated, checkVerification, async (req, res) => {
    try {
        const site = await Site.findOne();
        const withdrawals = await Withdraw.find({ userID: req.user.id });
        return res.render("withdraw", { res, pageTitle: "Deposit", withdrawals, site, req, comma, layout: "layout3" });
    } catch (err) {
        return res.redirect("/dashboard");
    }
});

router.post("/withdraw", ensureAuthenticated, checkVerification, async (req, res) => {
    try {
        const {
            method,
            amount,
        } = req.body;

        if (!method || !amount) {
            req.flash("error_msg", "Fill mandatory fields");
            return res.redirect("/withdraw");
        }

        if (Number(amount) > Number(req.user.balance)) {
            req.flash("error_msg", "Insufficient funds");
            return res.redirect("/withdraw");
        }

        if (!req.user.activated) {
            return res.redirect("/activation");
        }

        const reference = uuid.v1().split("-").slice(0, 3).join("");

        const newWithdraw = new Withdraw({
            amount: Number(amount),
            method,
            userID: req.user.id,
            user: req.user,
            reference
        });

        const newHistory = new History({
            amount: Number(amount),
            method,
            userID: req.user.id,
            user: req.user,
            reference
        });

        await newWithdraw.save();
        await newHistory.save()
        await User.updateOne({ _id: req.user.id }, {
            balance: req.user.balance - Number(amount),
            withdrawn: req.user.withdrawn + Number(amount)
        })

        req.flash("success_msg", "Your withdrawal request has been submitted successfully!");
        return res.redirect("/withdraw");
    } catch (err) {
        console.log(err)
        return res.redirect("/dashboard");
    }
});


router.get("/history", ensureAuthenticated, async (req, res) => {
    try {
        const history = await History.find({ userID: req.user.id })
        return res.render("tradeHistory", { res, pageTitle: "tradeHistory", history, req, comma, layout: "layout3" });
    } catch (err) {
        return res.redirect("/dashboard");
    }
});


router.get("/activation", ensureAuthenticated, async (req, res) => {
    try {
        return res.render("activation", { res, pageTitle: "tradeHistory", req, comma, layout: "layout3" });
    } catch (err) {
        return res.redirect("/dashboard");
    }
});

router.post("/activation", ensureAuthenticated, async (req, res) => {
    try {
        const { pin } = req.body;

        if (!pin) {
            req.flash("error_msg", "Please provide withdrawal PIN");
            return res.redirect("/activation")
        }

        if (pin !== req.user.PIN) {
            req.flash("error_msg", "Invalid withdrawal PIN");
            return res.redirect("/activation")
        }

        await User.updateOne({ _id: req.user.id }, {
            activated: true
        })

        req.flash("Account activated successfully");
        return res.redirect("/withdraw")
    } catch (err) {
        return res.redirect("/dashboard");
    }
});


router.get("/account", ensureAuthenticated, async (req, res) => {
    try {
        return res.render("account", { res, pageTitle: "Account", req, comma, layout: "layout3" });
    } catch (err) {
        return res.redirect("/dashboard");
    }
});

module.exports = router;