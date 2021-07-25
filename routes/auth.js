const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
//const flash = require('connect-flash');

router.get('/signup', (req,res) => {
     res.render('signup');
});

router.post('/signup', async (req, res) => {
   try{
      const newUser = await User.register(new User({
         username: req.body.username,
         email: req.body.email
      }), req.body.password);
      req.flash("success", `Signed you up as ${newUser.username}`);
      req.flash("success", "Sign in done ! Welcome to App! Join!");
      passport.authenticate('local')(req, res, () => {
          res.redirect('/comics');
      });
   }catch(err){
       console.log(err);
       res.send(err);
   }
});

//login-page
router.get("/login", (req,res) => {
    res.render('login');
});
//login
router.post("/login", passport.authenticate('local', {
    successRedirect: '/comics',
    failureRedirect: '/login',
    failureFlash: true,
	successFlash: `Logged in successFully ! Welcome to app !`
})); 

//logout
router.get("/logout",(req,res) => {
    req.logOut();
    req.flash("success", `Logged Out! Goodßye !`);
    res.redirect('/comics');
});

module.exports = router;