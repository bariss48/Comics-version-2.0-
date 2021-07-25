const Comic = require('../models/comic');
const Comment = require('../models/comment');


const comic_seeds = [
		{title:"Wonder-woman",
         description:"adasdasd",
         author:"Random",
         publisher:"Dc",
         date: "2021-01-18",
         series:"undefined",
         issue:2,
         genre:"action",
         color:true,
         image_link: "https://cdn.vox-cdn.com/thumbor/-SZx6yXSxpsNl6DToYfxXZU97kE=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/20046569/IMG_7C75CA50E93B_1.jpeg"
			
		},
		{
        title:"Batman",
        description:"Yarasa Adam",
        author:"Random",
        publisher:"Dc",
        date: "2021-01-18",
        series:"undefined",
        issue:2,
        genre:"action",
        color:true,
        image_link: "https://i.pinimg.com/originals/4e/ce/1b/4ece1b28f3a4e042a3e6ca5c991e2199.png"
		},
		{
		title: "Flash",
		description: "hızlı koşan çocuk",
		author:"Random",
        publisher:"Dc",
        date: "2021-01-18",
        series:"undefined",
        issue:4,
        genre:"action",
        color:true,
        image_link: "https://i.pinimg.com/originals/14/7e/79/147e79b1134e29c06887f1ddf3023961.png"
		}
]

const seed = async () => {
	// Delete all the current consoles and comments
	await Comic.deleteMany();
	console.log("Deleted All the Consoles!")
	
	await Comment.deleteMany();
	console.log("Deleted All the Comments!")
	
	// Create three new consoles
//	for (const comic_seed of comic_seeds) {
//		let comic = await Comic.create(comic_seed);
//		console.log("Created a new console!", comic.title)
		// Console a new comment for each comi
//		await Comment.create({
//			text: "I ruved this new Console!",
//			user: "Nintendo",
//			comicId: comic._id
//		})
//		console.log("Created a new Comment!")
//	}
	
}

module.exports = seed;