const User = require("../models/user");

module.exports.signup_page=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup=async (req,res)=>{
    try{
        let {username , email , password} = req.body;
    const newUser = new User({email , username});
    const RegUser = await User.register(newUser,password);
    console.log(RegUser);
    req.login(RegUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success" , "Welcome to Wanderlust");
        res.redirect("/listings");
    });
    }
    catch(err){
        req.flash("error" , "Username Already Exists");
        res.redirect("/signup")
    }
    
};

module.exports.login_page=(req,res)=>{
    res.render("users/signin.ejs");
}

module.exports.login=async (req,res)=>{
    req.flash("success","Welcome to WanderLust you Signin");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout=async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logout Successful");
        res.redirect("/listings");
    });
}