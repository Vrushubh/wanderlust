// mongodb+srv://vrushubh:Jh1QTXOVrQoObfM1@cluster0.r3plj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// Jh1QTXOVrQoObfM1
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();

}

const express = require("express");
const app = express();

const mongoose = require("mongoose");

const path = require("path");

const ejsMate = require("ejs-mate");
const Joi = require('joi');
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require('connect-mongo');


const { nextTick } = require("process");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user.js");

const dbURL = process.env.ATLASDB_URL;

main()
    .then(()=>{
        console.log("Connected to Database");
    })
    .catch((err)=>{
        console.log(err);
    })

async function main() {
    await mongoose.connect(dbURL);
}

const store = MongoStore.create({
    mongoUrl:dbURL,
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter: 24*60*60,
});

store.on("error",()=>{
    console.log("Error");
    
})

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expire : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
    },
};



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
    res.locals.logi = req.user;
    next();
});




app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method")); 
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, "/public")));






const port = 3000;
app.listen(port,()=>{
    console.log("App is Listening Port : "+port);
})

app.get("/",(req,res)=>{
    res.render("index.ejs");
})

app.use("/listings" , listingRouter);

app.use("/listings/:listingId/review" , reviewRouter);

app.use("/" , userRouter);



app.all("*",(req,res,next)=>{
    next(new ExpressError(500,"Page Not Found ! "));
})

app.use((err,req,res,next)=>{
    let { status =500 , message = "Something Wrong ! " } = err;
    res.status(status).render("error.ejs" , {err});
    // res.status(status).send(message);
})