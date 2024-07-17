const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirecUrl } = require("../middleware.js");
const userContoller = require("../controllers/users.js")

router.route("/signup").get(userContoller.renderSignupForm)
.post(userContoller.signup )

router.route("/login").get( userContoller.renderLoginForm)
.post(saveRedirecUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userContoller.login );

router.get("/logout", userContoller.logout );

module.exports = router;