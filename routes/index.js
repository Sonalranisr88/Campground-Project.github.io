var express = require("express");
var router = express.Router();
var passport = require("passport");
const user = require("../models/user");
var User = require("../models/user")

router.get("/",function(req, res){
    res.render("landing");
});


router.get("/register",function(req,res){
    res.render("register");
});

router.post("/register",function(req,res){
    // res.send("hello and welcome to the routing page")
    var newUser = new User({username:req.body.username});
    User.register(newUser , req.body.password)
    passport.authenticate("local");
    req.flash("success","Welcome to YelpCamp "+ newUser.username);
    // console.log(user.username);
    // console.log(User.username);
    // console.log(newUser);
    // console.log(newUser.username);
    res.redirect("/campgrounds");
    });


router.get("/login",function(req,res){
        res.render("login");
        
    });

router.post("/login",passport.authenticate("local",{
        successRedirect: "/campgrounds",
        failureRedirect: "/login"   
    }),function(req,res){
    });
   
router.get("/Logout",function(req,res){
        req.logout(function(err) {
            if (err) {
              return next(err);
            }
        req.flash("success","You Logged Out!!");
        res.redirect("/");
        });
        });
        
module.exports = router;

