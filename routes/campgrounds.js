 var express = require("express");
 var router = express.Router();
 var Campground = require("../models/campground");
 var middleware =require("../middleware/index");

router.get("/", async function(req, res) {
    var campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds:campgrounds,currentUser: req.user});
}); 

router.post("/",middleware.isLoggedIn, async function(req,res){
        var name = req.body.name;
        var price = req.body.price;
        var image = req.body.image;
        var desc =req.body.description;
        var author = {
            id: req.user._id,
            username: req.user.username
        }
        var newCampground = {name:name ,price:price, image:image , description:desc , author: author};
        var campground = await Campground.create(newCampground);
        res.redirect("/campgrounds");
        });

router.get("/new",middleware.isLoggedIn, function(req,res){
        res.render("campgrounds/new");
    });

router.get("/:id",async function(req,res){
    var foundCampground = await Campground.findById(req.params.id).populate("comments").exec();
    res.render("campgrounds/show",{campground:foundCampground});
});

router.get("/:id/edit",middleware.checkCampgroundOwnership, async function(req,res){
    var foundCampground = await Campground.findById(req.params.id)
    res.render("campgrounds/edit",{campground:foundCampground});
      
});

router.put("/:id",middleware.checkCampgroundOwnership, async function(req,res){
        var body = req.body.campground;
        var updateCampground = await Campground.findByIdAndUpdate(req.params.id,(body));
        res.redirect("/campgrounds/"+ req.params.id);
    });

router.delete("/:id",middleware.checkCampgroundOwnership, async function(req,res){
    var updatedCampground = await Campground.findByIdAndRemove(req.params.id);
    res.redirect("/campgrounds");
});

module.exports = router;
