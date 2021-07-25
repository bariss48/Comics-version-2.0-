const express = require('express');
const router = express.Router({mergeParams: true});
const Comic = require('../models/comic');
const Comment = require('../models/comment');
const isLoggedIn = require('../utils/isLoggedIn');
const checkComicOwner = require('../utils/checkComicOwner');

router.get("/", async (req,res) => {
    console.log(req.user);
    try{
        const comics = await Comic.find().exec();
        res.render("comics",{comics});
    }catch(err){
        console.log(err);
        res.send("hata hata");
    }
})
//CREATE
router.post("/",isLoggedIn, async (req,res) => {
      const genre = req.body.genre.toLowerCase();
      const newComic = {
          title: req.body.title,
          description: req.body.description,
          author:req.body.author,
          publisher:req.body.publisher,
          date:req.body.date,
          series:req.body.series,
          issue:req.body.issue,
          genre,
          color: !!req.body.color,
          image_link: req.body.image_link,
          owner: {
              id: req.user._id,
              username: req.user.username
          },
          upvote: [req.user.username],
          downvotes: [] 
    }
      try {
        const comic = await Comic.create(newComic);
        req.flash("success","Comic created!")
        res.redirect("/comics/"+ comic._id);
      } catch (err) {
          req.flash("error", "Error cant created comic!")
          res.redirect("/comics");
      }
})

router.get("/new",isLoggedIn,(req,res) => {
    res.render("comics_new");
})

//search
router.get("/search", async (req,res) => {
      try{
          const comics = await Comic.find({
              $text: {
                  $search: req.query.term
              }
          });
          res.render("comics", {comics});
      }catch(err){
          console.log(err);
        res.send("hata");
      }
})

//genre kategori

router.get("/genre/:genre", async (req,res) => {
  // check if the given genre is valid
  const validGenres = ["superhero","sci-fi","horror","fantasy","action","fantastic","superhero"];
  if ( validGenres.includes(req.params.genre.toLocaleLowerCase())){
       const comics = await Comic.find({genre: req.params.genre}).exec();
       res.render("comics",{comics});
  }else{
      res.send("Please enter valid genre");
  }
  // if yes go
  // if no send an error

});

//Vote
router.post("/vote", isLoggedIn, async (req,res) =>{
    console.log("Request body:", req.body);

  //  {
  //      comicId:"abc123",
  //      voteType:"up" or "down"
  //  }
  const comic = await Comic.findById(req.body.comicId);
  const alreadyUpvoted = comic.upvotes.indexOf(req.user.username);
  const alreadyDownvoted = comic.downvotes.indexOf(req.user.username);
  let response = {}

  if(alreadyUpvoted === -1 && alreadyDownvoted === -1){
     if(req.body.voteType === "up"){
        comic.upvotes.push(req.user.username);
        comic.save();
        response = {message: "Upvote tallied!", code: 1}
     }else if (req.body.voteType === "down"){
        comic.downvotes.push(req.user.username);
        comic.save();
        response = {message: "Downvote tallied!", code: -1} 
     }else{
        response = {message: "Error 1", code: "err"}
     }
  }else if(alreadyUpvoted >= 0){
    if(req.body.voteType === "up"){
        comic.upvotes.pull(alreadyUpvoted, 1);
        comic.save();
        response = {message: "Upvote removed", code: 0}
    }else if (req.body.voteType === "down"){
        comic.upvotes.pull(alreadyUpvoted, 1);
        comic.downvotes.push(req.user.username);
        comic.save();
        response = {message: "Changed to downvote", code: -1}
    }else{
        response = {message: "Error-2", code: "err"}
    }
  }else if(alreadyDownvoted >= 0){
    if(req.body.voteType === "up"){
        comic.downvotes.pull(alreadyDownvoted, 1);
        comic.upvotes.push(req.user.username);
        comic.save();
        response = {message: "Changed to upvote", code: 1}
    }else if (req.body.voteType === "down"){
        comic.downvotes.pull(alreadyDownvoted, 1);
        comic.save()
        response = {message: "Removed downvote", code: 0}
    }else{
        response = {message: "Error-3", code: "err"}
    }
  }else{
      //error
      response = {message: "Error-4", code: "err"}
  }
   //update score
   response.score = comic.upvotes.length - comic.downvotes.length;
   res.json(response);
})


router.get("/:id", async (req,res) => {
    try {
       const comic = await Comic.findById(req.params.id).exec();
       const comments = await Comment.find({comicId: req.params.id});
       res.render("comics_show",{comic,comments})
    } catch (err) {
        console.log(err);
        res.send("hata!");
    }
    })

router.get("/:id/edit",checkComicOwner, async (req,res) => {
    //Check if the user is logged in
    // if not logged in,redirect to /login
    //İf logged in check if they own the comic
    // İf not redirect back to show page
    //If owner render the form to edit
        const comic = await Comic.findById(req.params.id).exec();
         res.render("comics_edit",{comic});
      //  try {
      //      const comic = await Comic.findById(req.params.id).exec();
      //     res.render("comics_edit",{comic});
      //  } catch (err) {
      //      console.log(err);
      //      res.send("hata");
      //  }
    })
//EDIT
router.post("/:id/edit", async (req,res) => {
    try {
        const comic = await Comic.findById(req.params.id).exec();
        res.render("comics_edit",{comic});
    } catch (err) {
        console.log(err);
        res.send("hata");
    }
       // try {
       //     const comic = await Comic.findById(req.params.id).exec();
       //     res.render("comics_edit",{comic});
       // } catch (err) {
       //     console.log(err);
       //     res.send("hata");
       // }
    })
// UPDATE
router.put('/:id',checkComicOwner, async (req, res) => {
      const genre = req.body.genre.toLowerCase();
      const comicBody = {
          title: req.body.title,
          description: req.body.description,
          author:req.body.author,
          publisher:req.body.publisher,
          date:req.body.date,
          series:req.body.series,
          issue:req.body.issue,
          genre,
          color: !!req.body.color,
          image_link: req.body.image_link
      }
      try {
        const comic = await Comic.findByIdAndUpdate(req.params.id, comicBody, {new: true}).exec();
        req.flash("success", "Comic Updated!");
        res.redirect(`/comics/${req.params.id}`);
      } catch (err) {
          console.log(err);
          req.flash("error", "Error not update!");
          res.redirect("/comics");
      }
})

router.delete("/:id",checkComicOwner,async (req, res) => {
    try {
        const deletedComic = await Comic.findByIdAndDelete(req.params.id).exec();
         req.flash("success","Comic deleted!");
         res.redirect("/comics");   
    } catch (err) {
        console.log(err);
        req.flash("error","Error not deleting!");
        res.send("hata hata");
    }
})

module.exports = router;