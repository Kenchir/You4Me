let express = require("express");
let router = express.Router();
const User = require("../models/user");

//console.log(upload)

router.get("/home", (req, res) => res.render("index"));

router.get("/help", (req, res) => res.render("help"))
router.get("/contact", (req, res) => res.render("contact"))
router.get("/blog", (req, res) => res.render("blog"))
router.get("/about", (req, res) => res.render("about"))

router.post("/help", (req, res) => {
    const { county, subcounty, location, age, phone, fname, lname } = req.body;
    console.log(req.body)
    if (!county) {
        // console.log("error")
        req.flash("error", "County Missing")
        res.redirect("back")
        return;
    }
    if (!subcounty) {
        // console.log("error")
        req.flash("error", "Sub County Missing")
        res.redirect("back")
        return;
    }
    if (!fname) {
        // console.log("error")
        req.flash("error", "First name Missing")
        res.redirect("back")
    }
    if (!lname) {
        // console.log("error")
        req.flash("error", "Last name Missing")
        res.redirect("back")
    }
    if (!location) {
        // console.log("error")
        req.flash("error", "Location Missing")
        res.redirect("back")
    }
    if (!age) {
        // console.log("error")
        req.flash("error", "Age Missing")
        res.redirect("back")
    }
    if (![phone]) {
        // console.log("error")
        req.flash("error", "Phone number Missing")
        res.redirect("back")
    }
})

module.exports = router;