require('dotenv').config();
var express         = require("express"), 
    app             = express(), 
    bodyParser      = require("body-parser"), 
    mongoose        = require("mongoose"),
    seedDB          = require("./seeds"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash")
    
// acquiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")
    

// have a backup url in case something went wrong (good practice)
var url = process.env.DATABASEURL || mongoose.connect('mongodb://localhost:27017/yelp_camp_v13', { useNewUrlParser: true });
mongoose.connect(url, { useNewUrlParser: true });
// mongoose.connect('mongodb://hussein:onlyuser1@ds143511.mlab.com:43511/yelpcamp_alawamhm', { useNewUrlParser: true });
app.locals.moment = require("moment");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //dirname is the directory we are at already
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // seed the database

// passport configuration
app.use(require("express-session")({
    secret: "this can be anything we want",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
// adds the req.user to every route, whatever we put inside req.user is whatever
// is available inside our template
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//start server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp has Started!!");
});