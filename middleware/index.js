var middleWareObject = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middleWareObject.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be looged in to do that"); // this won't display anything
    // all it does is in the flash, it says that
    res.redirect("/login");
}

middleWareObject.checkCampgroundOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err || !foundCampground){
                req.flash("error", "Campground not found");
                res.redirect("back");
            }
            else {
                // if authenticated, does user own the campground?
                // we use the .equals because the foundCampground.author.id
                // returns a mongoose object and req.user._id is a string
                if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                    // render edit campgrounds page
                    next();
                }else {
                    // redirect somewhere
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        })
    } else { 
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back"); // take the user back to where they came from
    }
}

middleWareObject.checkCommentOwnership = function(req, res, next){
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            }
            else {
                // if authenticated, does user own the comment?
                // we use the .equals because the foundCmment.author.id
                // returns a mongoose object and req.user._id is a string
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    // render edit comment page
                    next();
                }else {
                    req.flash("error", "You don't have permission to do that");
                    // redirect somewhere
                    res.redirect("back");
                }
            }
        })
    } else { 
        req.flash("error", "You need to be looged in to do that");
        res.redirect("back"); // take the user back to where they came from
    }
}

module.exports = middleWareObject;