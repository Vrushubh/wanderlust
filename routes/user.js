const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const UserController=require("../controllers/user.js");
const { route } = require("./listing.js");

router
    .route("/signup")
    .get(UserController.signup_page)
    .post(saveRedirectUrl ,wrapasync( UserController.signup));

router
    .route("/login")
    .get(wrapasync(UserController.login_page))
    .post(saveRedirectUrl,passport.authenticate("local",{failureRedirect : '/login',failureFlash: true}) , UserController.login);

router.get("/logout",UserController.logout);

module.exports = router;