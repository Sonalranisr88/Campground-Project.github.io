var express = require("express");
var router = express.Router({mergeParams : true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware =require("../middleware");

router.get("/new",middleware.isLoggedIn, async function(req,res){
    var campground = await Campground.findById(req.params.id);
    res.render("comments/new",{campground: campground});
});

router.post("/",middleware.isLoggedIn ,async function(req,res){
    var campground = await Campground.findById(req.params.id);
    var comment = await Comment.create(req.body.comment);
    comment.author.id = req.user._id
    comment.author.username = req.user.username
    comment.save()
    if(comment && campground){
        campground.comments.push(comment);
        campground.save();
        req.flash("success","Successfully Added Comment"); 
        res.redirect('/campgrounds/'+ campground._id);
        
    }
});

router.get("/:comment_id/edit",middleware.checkCommentOwnership, async function(req,res){
    var foundComment = await Comment.findById(req.params.comment_id)
    res.render("comments/edit",{campground_id: req.params.id,comment:foundComment});
});

router.put("/:comment_id", async function(req,res){
    var body = req.body.comment;
    // console.log("New body", body);
    // console.log("Show request params", req.params);
    var updatedComment = await Comment.findByIdAndUpdate(req.params.comment_id,(body));
    // console.log("Updated body", updatedComment);

    res.redirect("/campgrounds/"+ req.params.id);
});

router.delete("/:comment_id", async function(req,res){
    var updatedComment = await Comment.findByIdAndRemove(req.params.comment_id);
    req.flash("success","Comment Deleted"); 
    res.redirect("/campgrounds");
});

module.exports = router;
