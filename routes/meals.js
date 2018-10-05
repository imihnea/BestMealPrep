var express = require("express");
var router  = express.Router();
var meal = require("../models/meal");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var { isLoggedIn, checkUsermeal, checkUserComment, isAdmin, isSafe } = middleware; // destructuring assignment

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//INDEX - show all meals
router.get("/", function(req, res){
  if(req.query.search && req.xhr) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all meals from DB
      meal.find({name: regex}, function(err, allmeals){
         if(err){
            console.log(err);
         } else {
            res.status(200).json(allmeals);
         }
      });
  } else {
      // Get all meals from DB
      meal.find({}, function(err, allmeals){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(allmeals);
            } else {
              res.render("meals/index",{meals: allmeals, page: 'meals'});
            }
         }
      });
  }
});

//CREATE - add new meal to DB
router.post("/", isLoggedIn, isSafe, function(req, res){
  // get data from form and add to meals array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var ingredients = req.body.ingredients;
  var category = req.body.category;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  var cost = req.body.cost;
  var newmeal = {name: name, image: image, ingredients: ingredients, category: category, description: desc, cost: cost, author:author};
    // Create a new meal and save to DB
    meal.create(newmeal, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to meals page
            console.log(newlyCreated);
            res.redirect("/meals");
        }
  });
});

//NEW - show form to create new meal
router.get("/new", isLoggedIn, function(req, res){
   res.render("meals/new"); 
});

// SHOW - shows more info about one meal
router.get("/:id", function(req, res){
    //find the meal with provided ID
    meal.findById(req.params.id).populate("comments").exec(function(err, foundmeal){
        if(err || !foundmeal){
            console.log(err);
            req.flash('error', 'Sorry, that meal does not exist!');
            return res.redirect('/meals');
        }
        console.log(foundmeal)
        //render show template with that meal
        res.render("meals/show", {meal: foundmeal});
    });
});

// EDIT - shows edit form for a meal
router.get("/:id/edit", isLoggedIn, checkUsermeal, function(req, res){
  //render edit template with that meal
  res.render("meals/edit", {meal: req.meal});
});

// PUT - updates meal in the database
router.put("/:id", isSafe, function(req, res){
    var newData = {name: req.body.name, image: req.body.image, ingredients: req.body.ingredients, category: req.body.category, description: req.body.description, cost: req.body.cost};
    meal.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, meal){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/meals/" + meal._id);
        }
    });
});

// DELETE - removes meal and its comments from the database
router.delete("/:id", isLoggedIn, checkUsermeal, function(req, res) {
    Comment.remove({
      _id: {
        $in: req.meal.comments
      }
    }, function(err) {
      if(err) {
          req.flash('error', err.message);
          res.redirect('/');
      } else {
          req.meal.remove(function(err) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('/');
            }
            req.flash('error', 'Meal deleted!');
            res.redirect('/meals');
          });
      }
    })
});

module.exports = router;