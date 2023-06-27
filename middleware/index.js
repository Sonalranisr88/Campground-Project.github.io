
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj ={};
middlewareObj.checkCommentOwnership=async function (req,res,next){
    if(req.isAuthenticated()){
        var foundComment = await Comment.findById(req.params.comment_id)
         if(foundComment.author.id.equals(req.user._id)){   
                next();
            }else{
                req.flash("error","You don't have permission to do That!!!")
                res.redirect("back");
            }
        }else{
            req.flash("error","You need to be logged in to do That!!!");
            res.redirect("back");
    };

}

middlewareObj.checkCampgroundOwnership =async function (req,res,next){
    if(req.isAuthenticated()){
        var foundCampground = await Campground.findById(req.params.id)
            if(foundCampground.author.id.equals(req.user._id)){
                next();
            }else{
                req.flash("error","You don't have permission to do That!!!")
                res.redirect("back");
            }
        }else{
            req.flash("error","You need to be logged in to do That!!!");
            res.redirect("back");
    };

}

middlewareObj.isLoggedIn= function (req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do That!!!");
    res.redirect("/login");
    }

module.exports = middlewareObj
