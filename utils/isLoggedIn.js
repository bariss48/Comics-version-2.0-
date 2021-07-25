
const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
        // else giriyor kod
        req.flash("error","You must be logged in this app");
		res.redirect("/login");
	}	
};

module.exports = isLoggedIn;
