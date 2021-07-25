const Comic = require('../models/comic');

const checkComicOwner = async (req,res,next) => {
    if (req.isAuthenticated()){
        const comic = await Comic.findById(req.params.id).exec();
        if(comic.owner.id.equals(req.user._id)){
        next();
        }else{
            req.flash("You dont have permission to do that!");
            res.redirect("back");
        }
    }else{
        req.flash("You Must Log-In !");
        res.redirect("login");
    }
}

module.exports = checkComicOwner;