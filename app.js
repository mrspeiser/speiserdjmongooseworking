var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/speiserdj");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


//Schema Setup
var homepostsSchema = new mongoose.Schema({
	title: String,
	image: String,
	description: String
});

var Homepost = mongoose.model("Homepost", homepostsSchema);


var userSchema = new mongoose.Schema({
	firstname: String,
	lastname: String,
	username: String,
	password: String,
	email: String,
	zipcode: String
});

var User = mongoose.model("User", userSchema);


var newsletterSchema = new mongoose.Schema({
	email: String,
	zipcode: String
});

var Newsletter = mongoose.model("Newsletter", newsletterSchema);

//landing page
app.get("/", function(req, res){
	res.render("landing");
});


//home page, view posts and highlights
app.get("/home", function(req, res){
	Homepost.find({}, function(err, allHomeposts){
		if(err){
			console.log(err);
		} else {
			res.render("front/home",{homeposts:allHomeposts});
		}
	});
});

//home page posts
app.post("/home", function(req, res){
	//get data from form and add to home page
	var title = req.body.title;
	var image = req.body.image;
	var description = req.body.description;
	var newHomePost = {title: title, image: image, description: description}
	Homepost.create(newHomePost, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			res.redirect("/home");
		}
	});
});

//Admin side, Create posts for home page, view users and emails
app.get("/adminpanel", function(req, res){
	User.find({}, function(err, allUsers){
		if(err){
			console.log(err);
		} else {
			res.render("back/adminpanel",{user:allUsers});
		}
	});
});




//Admin/Postcontent
app.get("/adminpanel/newpost", function(req, res){
	res.render("back/newpost");
});





//Admin/Users
app.get("/adminpanel/users", function(req, res){
	User.find({}, function(err, allUsers){
		if(err){
			console.log(err);
		} else {
			res.render("back/users",{user:allUsers});
		}
	});
});




//Admin/Newsletters
app.get("/adminpanel/newsletters", function(req, res){
	res.send("this is page for newsletter stuff");
});










// var newsletter = [];

app.post("/adminpanel", function(req, res){
//get data from body-parser (landing page form) and save it to variable
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	var zipcode = req.body.zipcode;
//pass everything into object
	var newUser = {firstname: firstname, lastname: lastname, username: username, password: password, email: email, zipcode: zipcode}
//push the above object into the mongoose userinfo
	User.create(newUser, function(err, newlyCreated){
		if(err){
			console.log(err)
		} else {
			res.redirect("/home");
		}
	});
});

app.post("/", function(req, res){
	var email = req.body.email;
	var zipcode = req.body.zipcode;
	var newNewsletter = {email: email, zipcode: zipcode}
	Newsletter.create(newNewsletter, function(err, newlyCreated){
		if(err){
			console.log(err)
		} else {
			res.redirect("back/adminpanel");
		}
	});
});

// app.post("/", function(req, res){
// 	res.send("you hit Newsletter post route!")
// });

//start server
var server = app.listen(3000, function(){
	console.log("server has started!", server.address().port);
});









