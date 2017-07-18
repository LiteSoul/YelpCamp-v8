const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended:true}))
//connect to a db, and creating it:
mongoose.connect("mongodb://localhost/yelp_camp")

// Campground.create({
// 	name:"Vicio-el-rocknroll",
// 	image:"https://farm4.staticflickr.com/3393/3510641019_bc91eb6818.jpg"
// },function(err,campground){
// 	if(err){
// 		console.log("ERROR IS: " + err)
// 	} else{
// 		console.log("You just created: " + campground)
// 	}
// })

// var campinggrounds = [
// 	{name:"Rosario", image:"https://farm4.staticflickr.com/3062/2984119099_82336dfc3b.jpg"},
// 	{name:"Victoria", image:"https://farm7.staticflickr.com/6103/6333668591_90e7c2bc72.jpg"},
// 	{name:"Colastiné", image:"https://farm4.staticflickr.com/3393/3510641019_bc91eb6818.jpg"},
// 	{name:"Rosario", image:"https://farm4.staticflickr.com/3062/2984119099_82336dfc3b.jpg"},
// 	{name:"Victoria", image:"https://farm7.staticflickr.com/6103/6333668591_90e7c2bc72.jpg"},
// 	{name:"Colastiné", image:"https://farm4.staticflickr.com/3393/3510641019_bc91eb6818.jpg"},
// 	{name:"Rosario", image:"https://farm4.staticflickr.com/3062/2984119099_82336dfc3b.jpg"},
// 	{name:"Victoria", image:"https://farm7.staticflickr.com/6103/6333668591_90e7c2bc72.jpg"},
// 	{name:"Colastiné", image:"https://farm4.staticflickr.com/3393/3510641019_bc91eb6818.jpg"}
// ]

app.get("/", function(req, res) {
	res.render("landing")
})

//FIRST USE OF A FAT ARROW YAY!!
//INDEX route - show all campgrounds
app.get("/campgrounds", (req, res) => {
	//get all (all is {}) campgrounds from db:
	Campground.find({},(err,all_campings)=>{
		if(err){
			console.log(err)
		} else {
			//render it:
			res.render("index",{campgrounds:all_campings})
		}
	})
})

//CREATE route - add new campground to DB
app.post("/campgrounds", function(req, res){
	// get data from form and add to campgrounds array
	var name = req.body.name
	var image = req.body.image
	var description = req.body.description
	var newCampground = {name, image,description}
	//Create a new campground and save it to DB:
	Campground.create(newCampground,function(err,new_camp){
		if(err){console.log(err)}
		else{
			// redirect back to campgrounds, default is GET campgrounds:
			res.redirect("/campgrounds")	
		}
	})
})

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res){
	res.render("new")
})

//SHOW - show info about a single camp ID
app.get("/campgrounds/:id",function(req,res){
	//find the campground with provided id
	//that :id is being captured here with .params
	//mongoose gives us this method: .findById(id,callback)
	Campground.findById(req.params.id,function(err,foundCamp){
		if(err){console.log(err)}
		else{
			//render show template with that campground
			res.render("show",{campground:foundCamp})
		}
	})
})

app.get("*", function(req, res){
	res.send("404 NOTHING TO SEE HERE...")
})

app.listen(3000, function () {
	console.log("YelpCamp app listening on port 3000!")
})
