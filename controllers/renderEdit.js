const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({}); // Fetch all listings from the database
    res.render("listings/index.ejs", { allListings }); // Render the listings index page with fetched listings
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs"); // Render the new listing creation form
}
