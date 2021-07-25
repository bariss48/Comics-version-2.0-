const express = require('express');
const router = express.Router({mergeParams: true});
const Comment = require('../models/comment');
const Comic = require('../models/comic');
const isLoggedIn = require('../utils/isLoggedIn');
const checkCommentOwner = require('../utils/checkCommentOwner');

router.get("/new",isLoggedIn,(req,res) => {
    res.render("comments_new",{comicId: req.params.id})
 })

router.post("/",isLoggedIn, async (req,res) =>  {
      try {
      const comment = await Comment.create({
		    user: {
				id: req.user._id,
				username: req.user.username
			},
		    text: req.body.text,
            comicId: req.body.comicId
      });
      req.flash("success","Comment Created!");
      res.redirect(`/comics/${req.body.comicId}`)     
      }catch (err) {
		    req.flash("error","Error not creating comment!");
            console.log(err);
            res.redirect("/comics");  
      }
})

//Edit Comment - SHow the edit form
router.get("/:commentId/edit",checkCommentOwner, async (req, res) => {
	try {
		    const comic = await Comic.findById(req.params.id).exec();
            const comment = await Comment.findById(req.params.commentId).exec();
		    res.render("comments_edit", {comic, comment});
	} catch (err) {
		console.log(err);
		res.redirect("/comics");
	}
})

// Update Comment - Actually update in DB
router.put("/:commentId",checkCommentOwner, async (req, res) => {
	try {
		const comment = await Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.text}, {new: true})
		req.flash("success","Comment edited!");
		res.redirect(`/comics/${req.params.id}`);
	} catch (err) {
		console.log(err);
		req.flash("error","error not editing comic!");
		res.redirect("/comics");
	}
})

router.delete("/:commentId",checkCommentOwner, async (req, res) => {
	try{
            const comment = await Comment.findByIdAndDelete(req.params.commentId);
            req.flash("success","Comment Deleted!");
            res.redirect(`/comics/${req.params.id}`);
	} catch (err) {
		console.log(err);
		req.flash("error","Comment not deleting!");
		res.redirect("/comics");
	}
})

module.exports = router;