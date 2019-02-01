var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

//INDEX - show all campgrounds 
router.get("/", function(req, res){
    req.user;
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campgrounds: allCampgrounds, currentUser: req.user});
        }
    });

});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
   //get data from form and add to array
   var name = req.body.name;
   var price = req.body.price;
   var image = req.body.image;
   var desc = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    //Create new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
          res.redirect("/campgrounds");  
        }
    });
});

//NEW - show form
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW - shows more infos about one campground
router.get("/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err) {
          console.log(err);
      }  else {
          console.log(foundCampground);
          res.render("campgrounds/show", {campground: foundCampground});
      }
    });
});

//EDIT campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampgrounds){
       if(err) {
           res.redirect("/campgrounds");
       } else {
          res.redirect("/campgrounds/" + req.params.id); 
       }
    });
});

//DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
          res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
