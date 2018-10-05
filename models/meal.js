var mongoose = require("mongoose");

var mealSchema = new mongoose.Schema({
   name: String,
   image: String,
   ingredients: String,
   category: String,
   description: String,
   cost: Number,
   createdAt: { type: Date, default: Date.now },
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("meal", mealSchema);