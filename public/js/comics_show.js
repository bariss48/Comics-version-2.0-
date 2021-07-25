//SELECT ELEMENTS
const upvoteBtn = document.getElementById("upvote_btn");
const downvoteBtn = document.getElementById("downvote_btn");
const score = document.getElementById("score");
//HELPER FUNCTIONS
const sendVote = async (voteType) => {
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
    }
    if (voteType === "up"){
      options.body = JSON.stringify({
          voteType: "up",
          comicId
        })
    }else if (voteType === "down"){
      options.body = JSON.stringify({
          voteType: "down",
          comicId
        });
    }else{
       throw "votetype must be up or down"
    }

    await fetch("/comics/vote", options)
   .then(data => {
       return data.json()
   }).then(res => {
       console.log(res);
       handleVote(res.score, res.code)
   }).catch(err => {
       console.log(err);
   })
}
const handleVote = (newScore, code) => {
    score.innerText = newScore
}

//ADD EVENT LISTENERS
upvoteBtn.addEventListener("click", async function(){
    sendVote("up");
})
downvoteBtn.addEventListener("click", async function(){
    sendVote("down");
})
