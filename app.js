const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
//models require
const Campground = require('./models/campground')
const Comment = require('./models/comment')
//user model for auth
const User = require('./models/user')
//add seeds.js and execute seed function to destroy and create new sample data on db
const seedDB = require('./seeds')
seedDB()
//for user authentication
const passport = require('passport')
const LocalStrategy = require('passport-local')
const session = require('express-session')
//-------------------CONNECT TO DB--------------
//connect to a db, and creating it:
//mongoose.connect("mongodb://yelp:yelp@ds028310.mlab.com:28310/yelp")
// Using `mongoose.connect`...
mongoose.connect('mongodb://yelpv6:yelpv6@ds151963.mlab.com:51963/yelp-v6', {
	useMongoClient: true
	/* other options */
})

//---------------APP CONFIG-----------------
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
// official is this, but path not defined:
//app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(__dirname + '/public'))

//---------------PASSPORT CONFIG-----------------
app.use(
	session({
		secret: 'pasaporte falso',
		resave: false,
		saveUninitialized: false
	})
)
app.use(passport.initialize())
app.use(passport.session())
//use localstrategy and give it a method (User.authenticate)from local-mongoose plugin
passport.use(new LocalStrategy(User.authenticate()))
// use static serialize and deserialize of model for passport session support
//serializeUser and deserializeUser methods taken from local-mongoose, it's easier
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//creates middleware to pass user data (check if logged in) for EVERY route
app.use((req, res, next) => {
	res.locals.currentUser = req.user
	next()
})

//---------------APP ROUTING----------------
app.get('/', function(req, res) {
	res.render('landing')
})
//FIRST USE OF A FAT ARROW YAY!!
//INDEX route - show all campgrounds
app.get('/campgrounds', (req, res) => {
	//console.log(req.user) to check for user loggedin data or undefined
	//get all (all is {}) campgrounds from db:
	Campground.find({}, (err, all_campings) => {
		if (err) {
			console.log(err)
		} else {
			//render it:
			res.render('campgrounds/index', {
				campgrounds: all_campings
			})
		}
	})
})

//CREATE route - add new campground to DB
app.post('/campgrounds', function(req, res) {
	// get data from form and add to campgrounds array
	var name = req.body.name
	var image = req.body.image
	var description = req.body.description
	var newCampground = { name, image, description }
	//Create a new campground and save it to DB:
	Campground.create(newCampground, function(err, new_camp) {
		if (err) {
			console.log(err)
		} else {
			// redirect back to campgrounds, default is GET campgrounds:
			res.redirect('/campgrounds')
		}
	})
})

//NEW - show form to create new campground
app.get('/campgrounds/new', function(req, res) {
	res.render('campgrounds/new')
})

//SHOW - show info about a single camp ID
app.get('/campgrounds/:id', function(req, res) {
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

//----------COMMENTS ROUTES-------------
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
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
app.post('/campgrounds/:id/comments', isLoggedIn, function(req, res) {
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

//-------------AUTH ROUTES-----------------
app.get('/signup', (req, res) => {
	res.render('auth/signup')
})
app.post('/signup', (req, res) => {
	let newUser = new User({ username: req.body.username })
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			console.log(err)
			return res.render('auth/signup')
		}
		passport.authenticate('local')(req, res, () => {
			res.redirect('/campgrounds')
		})
	})
})
app.get('/login', (req, res) => {
	res.render('auth/login')
})
//app.post(login route, middleware, callback)
app.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/campgrounds',
		failureRedirect: '/login'
	}),
	(req, res) => {}
)
app.get('/logout', (req, res) => {
	req.logout() //this method comes with the pkg we installed
	res.redirect('/campgrounds')
})
//checks if is logged in before doing the next step
//this functions as a middleware, use it after a route, before the callback
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect('/login')
}

//-------------404 PAGE-----------------
app.get('*', (req, res) => {
	res.send('404 NOTHING TO SEE HERE...')
})
//-------------APP LISTEN 3000---------------
// process.env.PORT lets the port be set by Heroku, on localhost or codeanywhere is 3000
let port = process.env.PORT || 3000
//check connection through express
app.listen(port, function() {
	console.log('Our app is running on http://localhost:' + port)
})
