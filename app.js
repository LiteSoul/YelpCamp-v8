var express = require('express')
var app = express()
var bodyParser = require("body-parser")

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended:true}))

var campinggrounds = [
	{name:"Rosario", image:"https://farm4.staticflickr.com/3062/2984119099_82336dfc3b.jpg"},
	{name:"Victoria", image:"https://farm7.staticflickr.com/6103/6333668591_90e7c2bc72.jpg"},
	{name:"Colastiné", image:"https://farm4.staticflickr.com/3393/3510641019_bc91eb6818.jpg"},
	{name:"Rosario", image:"https://farm4.staticflickr.com/3062/2984119099_82336dfc3b.jpg"},
	{name:"Victoria", image:"https://farm7.staticflickr.com/6103/6333668591_90e7c2bc72.jpg"},
	{name:"Colastiné", image:"https://farm4.staticflickr.com/3393/3510641019_bc91eb6818.jpg"},
	{name:"Rosario", image:"https://farm4.staticflickr.com/3062/2984119099_82336dfc3b.jpg"},
	{name:"Victoria", image:"https://farm7.staticflickr.com/6103/6333668591_90e7c2bc72.jpg"},
	{name:"Colastiné", image:"https://farm4.staticflickr.com/3393/3510641019_bc91eb6818.jpg"}
]

app.get("/", function(req, res) {
	res.render("landing")
})

app.get("/campgrounds", function(req, res) {
	res.render("campgrounds",{campgrounds:campinggrounds})
})

app.post("/campgrounds", function(req, res){
	// get data from form and add to campgrounds array
	var name = req.body.name
	var image = req.body.image
	var newCampground = {name:name, image:image}
	campinggrounds.push(newCampground)
	// redirect back to campgrounds, default is to the get campgrounds:
	res.redirect("/campgrounds")
})

app.get("/campgrounds/new", function(req, res){
	res.render("new")
})

app.get("*", function(req, res){
    res.send("Movie not found...");
})

app.listen(3000, function () {
  console.log('YelpCamp app listening on port 3000!')
})
