const express = require('express')
const router = express.Router()
//models require
const Campground = require('../models/campground')

//CREATE route - add new campground to DB
router.post('/campgrounds', isLoggedIn, function(req, res) {
	// get data from form and add to campgrounds array
	var name = req.body.name
	var image = req.body.image
	var description = req.body.description
	let author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = { name, image, description, author }
	//Create a new campground and save it to DB:
	Campground.create(newCampground, function(err, new_camp) {
		if (err) {
			console.log(err)
		} else {
			console.log(new_camp)
			// redirect back to campgrounds, default is GET campgrounds:
			res.redirect('/campgrounds')
		}
	})
})

//NEW - show form to create new campground
router.get('/campgrounds/new', isLoggedIn, function(req, res) {
	res.render('campgrounds/new')
})

//SHOW - show info about a single camp ID
router.get('/campgrounds/:id', function(req, res) {
	//find the campground with provided id
	//that :id is being captured here with .params
	//mongoose gives us this method: .findById(id,callback)
	//comments are coming back with an array of ObjectId,so we need to .populate.exec
	//to populate the found campground with the comments
	Campground.findById(req.params.id)
		.populate('comments')
		.exec(function(err, foundCamp) {
			if (err) {
				console.log(err)
			} else {
				//render show template with that campground
				res.render('campgrounds/show', { campground: foundCamp })
			}
		})
})

//checks if is logged in before doing the next step
//this functions as a middleware, use it after a route, before the callback
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect('/login')
}

module.exports = router
