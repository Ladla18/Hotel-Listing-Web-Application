const express = require("express")
const app = express()
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")


const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
main().then(()=>{
    console.log("Connected to DB")
}).
catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")))


app.get("/",(req,res)=>{
    res.send("We are root")
})
// Index
app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings})
})

// New
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

// Show

app.get("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    const listing  = await Listing.findById(id)
    res.render("listings/show.ejs",{listing})
});

// Create
app.post("/listings",wrapAsync(async (req,res)=>{
const newListing = new Listing(req.body.listing);
await newListing.save();
res.redirect("listings");
}))
// edit
app.get("/listing/:id/edit",async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

// Update Route
app.put("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`)
})

// Delete Route
app.delete("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
})



// Err middleware
app.use((err,req,res,next)=>{
    res.send("Something went wrong")
})











app.listen(8080,()=>{
    console.log("Server is listening on 8080")
})