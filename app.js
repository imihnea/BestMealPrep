var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    flash          = require("connect-flash"),
    meal           = require("./models/meal"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    session        = require("express-session"),
    methodOverride = require("method-override");
// configure dotenv
require('dotenv').load();

//Some constants to check program, change when done

const hostname = '127.0.0.1';
const port = 3000;

//requiring routes
var commentRoutes    = require("./routes/comments"),
    mealRoutes       = require("./routes/meals"),
    indexRoutes      = require("./routes/index")
    
// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

// const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/bestmealprep';
const databaseUri = process.env.MONGODB_URI || 'mongodb://mihnea:test123@ds245022.mlab.com:45022/bestmealprep';

mongoose.set('useFindAndModify', false); // disables warnings
mongoose.set('useCreateIndex', true); //disables warnings
mongoose.connect(databaseUri, { useNewUrlParser: true })
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
//require moment
app.locals.moment = require('moment');
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Spoopy secret used to decode",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});


app.use("/", indexRoutes);
app.use("/meals", mealRoutes);
app.use("/meals/:id/comments", commentRoutes);

app.get("*", function(req, res){
    res.render("404");
});

// Port routing

// app.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The BestMealPrep Server Has Started!");
 });