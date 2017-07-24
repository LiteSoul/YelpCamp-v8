const mongoose = require("mongoose")

let commentSchema = mongoose.Schema({
	text: String,
	author: String
})

module.exports = mongoose.Model("Comment",commentSchema)