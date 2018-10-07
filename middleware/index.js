var Comment = require('../models/comment');
var meal = require('../models/meal');
module.exports = {
  isLoggedIn: function(req, res, next){
      if(req.isAuthenticated()){
          return next();
      }
      req.flash('error', 'You must be signed in to do that!');
      res.redirect('/login');
  },
  checkUsermeal: function(req, res, next){
    meal.findById(req.params.id, function(err, foundmeal){
      if(err || !foundmeal){
          console.log(err);
          req.flash('error', 'Sorry, that meal does not exist!');
          res.redirect('/meals');
      } else if(foundmeal.author.id.equals(req.user._id)){
          req.meal = foundmeal;
          next();
      } else {
          req.flash('error', 'You don\'t have permission to do that!');
          res.redirect('/meals/' + req.params.id);
      }
    });
  },
  checkUserComment: function(req, res, next){
    Comment.findById(req.params.commentId, function(err, foundComment){
       if(err || !foundComment){
           console.log(err);
           req.flash('error', 'Sorry, that comment does not exist!');
           res.redirect('/meals');
       } else if(foundComment.author.id.equals (req.user._id)){
            req.comment = foundComment;
            next();
       } else {
           req.flash('error', 'You don\'t have permission to do that!');
           res.redirect('/meals/' + req.params.id);
       }
    });
  },
  // isAdmin: function(req, res, next) {
  //   if(req.user.isAdmin) {
  //     next();
  //   } else {
  //     req.flash('error', 'This site is now read only thanks to spam and trolls.');
  //     res.redirect('back');
  //   }
  // },
  // isSafe: function(req, res, next) {
  //   if(req.body.image.match(/^https:\/\/\/.*/)) {
  //     next();
  //   }else {
  //     req.flash('error', 'Only images from imgur.com allowed.');
  //     res.redirect('back');
  //   }
  // }
}