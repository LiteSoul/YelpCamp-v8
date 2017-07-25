const mongoose = require("mongoose")
const Campground = require("./models/campground")
const Comment = require("./models/comment")

var data = [
	{name:"Rosario del Tala", image:"https://farm4.staticflickr.com/3062/2984119099_82336dfc3b.jpg",
		description:"This campground is great for campfires and tents, but don't be tempted...ha. Here's a bunch of numbers. They may look random but they're my phone number. I'm no hero. I just put my bra on."},
	{name:"Victoria", image:"https://farm7.staticflickr.com/6103/6333668591_90e7c2bc72.jpg",
		description:"This campground is great for campfires and tents, but don't be tempted...ha. Here's a bunch of numbers. They may look random but they're my phone number. I'm no hero. I just put my bra on."},
	{name:"Colastiné", image:"https://farm4.staticflickr.com/3393/3510641019_bc91eb6818.jpg",
		description:"This campground is great for campfires and tents, but don't be tempted...ha. Here's a bunch of numbers. They may look random but they're my phone number. I'm no hero. I just put my bra on."}
]

function seedDB(){
	// Clear/remove db Campground content
	// ----> but so far comments are not removed! eg. Comment.remove({})
	Campground.remove({},(err) => {
		if(err){console.log(err)}
		console.log("Removed campgrounds!")
		// Add a few campgrounds right after removing them, in this callback
		data.forEach(function(seed) {
			Campground.create(seed,function(err,campground){
				if(err){console.log(err)}
				else{
					console.log("campground added")
					// add a comment
					Comment.create({
						text: "I went there, it was great! Just very cold on winter! xoxo",
						author: "Piñón Fijo"
					}, function(err, comment){
						if(err){console.log(err)}
						else{
							campground.comments.push(comment)
							campground.save()
							console.log("New comment created")
						}
					})
				}
			})
		})
	})
}

module.exports = seedDB
