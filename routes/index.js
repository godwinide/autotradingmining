const Site = require("../model/Site");

const router = require("express").Router();


router.get("/", async (req, res) => {
    try {
        const site = await Site.findOne();
        return res.render("index", { pageTitle: "Welcome", site, req, res });
    }
    catch (err) {
        return res.redirect("/");
    }
});

router.get("/about", async (req, res) => {
    try {
        const site = await Site.findOne();
        return res.render("about", { pageTitle: "Welcome", site, req, res });
    }
    catch (err) {
        return res.redirect("/");
    }
});

router.get("/contact", async (req, res) => {
    try {
        const site = await Site.findOne();
        return res.render("contact", { pageTitle: "Welcome", site, req, res });
    }
    catch (err) {
        return res.redirect("/");
    }
});


module.exports = router;