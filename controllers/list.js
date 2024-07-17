const Listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken : mapToken });



module.exports.index = async (req, res) => {
    const allListings = await Listing.find({}); //Fetch all listings from the database
    res.render("listings/index.ejs", {allListings}); //Render the listings index page with fetched listings
} 

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs"); //Render the new listing creation form
}


module.exports.showListing = async (req, res) => {
    let { id } = req.params; //Extract listing ID from URL parameters
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner"); // Find the listing by ID
    if(!listing){
        req.flash("error","Listing does not exists")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", {listing}); //Render the listing details page with the fetched listing
}


module.exports.createListing = async ( req, res ) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing); //Create a new listing with the data from the request body
    newListing.owner = req.user._id;
    newListing.image = {url , filename}   
    newListing.geometry = response.body.features[0].geometry        
    let savedListing =  await newListing.save(); //Save the new listing to the database
    console.log(savedListing);
    req.flash("success"," New Listing Created ")
    res.redirect("/listings"); //Redirect to the listings index page
}


module.exports.editListing = async (req, res) => {
    let { id } = req.params; // Extract listing ID from URL parameters
    const listing = await Listing.findById(id); // Find the listing by ID
    if(!listing){
        req.flash("error","Listing does not exists")
        res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl=  originalImageUrl.replace("/upload","/upload/h_100,w_150");
    console.log(originalImageUrl)
    res.render("listings/edit.ejs", { listing,originalImageUrl }); // Render the listing edit form with the fetched listing
}


module.exports.updateListing = async (req, res) => {
    let { id } = req.params;  // Extract listing ID from URL parameters
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // Update the listing with the data from the request body
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename}
    await listing.save()
    }
    req.flash("success"," Listing Updated ")
    res.redirect(`/listings/${id}`); //Redirect to the updated listing's details page
}


module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;   //Extract listing ID from URL parameters
    let deletedListing = await Listing.findByIdAndDelete(id); // Delete the listing by ID
    req.flash("success","Listing Deleted");
    res.redirect("/listings"); //Redirect to the listings index page
    }

