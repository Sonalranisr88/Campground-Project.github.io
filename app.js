var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/yelp_camp",
 { useUnifiedTopology: true, useNewUrlParser: true })

app.use(bodyParser.urlencoded({extended:true})); 
app.set("view engine" ,"ejs");

var campgroundSchema =new mongoose.Schema({
    name: String,
    image:String,
    description:String
});

var Campground = mongoose.model("Campground",campgroundSchema);

app.get("/",function(req, res){
    res.render("landing");
});

app.get("/campgrounds", async function(req, res) {
    var campgrounds = await Campground.find({});
    res.render("index", {campgrounds:campgrounds});
}); 

app.post("/campgrounds", async function(req,res){
        var name = req.body.name;
        var image = req.body.image;
        var desc =req.body.description;
        var newCampground = {name:name, image:image , description:desc};

        var campground = await Campground.create(newCampground);
        res.redirect("/campgrounds");
    
        });

app.get("/campgrounds/new",function(req,res){
        res.render("new");
    });

app.get("/campgrounds/:id",async function(req,res){

    var foundCampground = await Campground.findById(req.params.id);
    res.render("show",{campground:foundCampground});
      
});

app.listen(3000,function(){
    console.log("The server started");
});