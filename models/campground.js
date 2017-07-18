const mongoose = require("mongoose")

//setup schema:
var campgroundSchema = new mongoose.Schema({
	name:String,
	image:String,
	description:String
})
//compile that schema into a model (usually w/ capital first letter)
//to have all the .methods:
//var Campground = mongoose.model("Campground",campgroundSchema)
// refactor above code to export it to a module
module.exports = mongoose.model("Campground",campgroundSchema)
