const express = require("express"); 
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); 

const Listing = require("../models/listing.js"); // Import the Listing model
const {isLoggedIn,validateListing} = require("../middleware.js")
const listingController = require("../controllers/list.js")
const multer = require("multer");//for forms media
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})

// Show All Listings
router.route("/").get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));


// Landing on new listing creation page
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id").get(wrapAsync(listingController.showListing))
.put(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, wrapAsync(listingController.deleteListing));

// Edit the Listing
router.get("/:id/edit",isLoggedIn, wrapAsync(listingController.editListing));




module.exports = router