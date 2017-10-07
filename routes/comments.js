const express = require('express')
const router = express.Router()

//----------COMMENTS ROUTES-------------
router.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
	//see SHOW campground route for method
	Campground.findById(req.params.id, function(err, foundCamp) {
		if (err) {
			console.log(err)
		} else {
			res.render('comments/new', { campground: foundCamp })
		}
	})
})

//CREATE route - add new comment to campground
router.post('/campgrounds/:id/comments', isLoggedIn, function(req, res) {
	//Create a new comment and save it to DB:
	Campground.findById(req.params.id, function(err, foundCamp) {
		if (err) {
			console.log(err)
			res.redirect('/campgrounds')
		} else {
			// get data from form and add to campground comments
			//but instead of these 3 sentences:
			//var author = req.body.comment.author
			//var text = req.body.comment.text
			//var newComment = {author, text}
			//we just use comment[array] sent from new.ejs
			Comment.create(req.body.comment, function(err, new_comm) {
				if (err) {
					console.log(err)
				} else {
					foundCamp.comments.push(new_comm)
					foundCamp.save()
					// redirect back to campground, default is GET campground:
					res.redirect('/campgrounds/' + foundCamp._id)
				}
			})
		}
	})
})

module.exports = router
