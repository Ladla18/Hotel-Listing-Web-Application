if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}


// Import required modules
const express = require("express"); // Import the Express framework for building web applications
const app = express(); // Create an instance of an Express application
const mongoose = require("mongoose"); // Import Mongoose for MongoDB object modeling
const path = require("path"); // Import the Path module for handling file and directory paths
const methodOverride = require("method-override"); // Import Method Override for supporting PUT and DELETE methods
const ejsMate = require("ejs-mate"); // Import EJS Mate for layout and partials support in EJS 
const ExpressError = require("./utils/ExpressError.js"); // Import a custom error class for handling errors
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash  = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");





// MongoDB connection URL    

const dbURL = process.env.ATLASDB_URL;

// Connect to MongoDB
main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

// Async function to connect to MongoDB
async function main() {
    await mongoose.connect(dbURL);
}

// Set up EJS as the template engine
app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", path.join(__dirname, "views")); // Set the directory for views
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies (for form submissions)
app.use(methodOverride("_method")); // Middleware to support PUT and DELETE methods using a query parameter (_method)
app.engine('ejs', ejsMate); // Use ejs-mate for EJS templates
app.use(express.static(path.join(__dirname, "/public"))); // Serve static files from the "public" directory


const store = MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("ERROr in mongo session store")
})
const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie:{
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000 ,
        httpOnly : true,
    }
}
// Main Route
// app.get("/", (req, res) => {
//     res.send("We are root"); // Respond with a simple message at the root route
// });


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user

    next();
})


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter)


// Middleware to handle undefined routes and throw a 404 error
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found")); // Throw a 404 error for undefined routes
});

// Error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err; // Destructure error object
    res.status(statusCode).render("error.ejs", { message }); // Render the error page with the error message
});

// Start the server and listen on port 8080
app.listen(8080, () => {
    console.log("Server is listening on 8080"); // Log a message indicating the server is running
});
