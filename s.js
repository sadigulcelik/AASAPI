//PRS Showdown
//Authors: Sadi Gulcelik, Ayesha Ali
//Date: 1/18/19

//required packages
var express = require('express');
var fs = require('fs');
var favicon = require('serve-favicon');
var app = express();
var dat = require(__dirname +'/models/Data');
var dev = require(__dirname +'/models/Developer');
var methodOverride = require('method-override');
app.use(methodOverride('_method'));

//set up server
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/images/logo.png'));
app.use(express.urlencoded());

//variables for login and villain strategies
var error = false;

var port = process.env.PORT || 3000;
app.listen(port, function(){
  //dataJS.log('Server started at '+ new Date()+', on port ' + port+'!');
});

app.get('/', function(request, response){
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('sign_up', {data:{message:"welcome"}});
});

//shows home page aka signup page
app.get('/sign_up', function(request, response){
  console.log("GET request: /sign_up");
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('sign_up', {});
});
//logs the user out and shows home page/signup page
app.get('/logout', function(request, response){
  console.log("GET request: /logout");
  //log the user  out code here
  response.redirect('/sign_up');
});

//shows instructions page
app.get('/instructions', function(request, response){
  console.log("GET request: /instructions");
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('instructions', {});
});

//shows results page for user with id, which shows api key and email
app.get('/users/:id', function(request, response){
  console.log("GET request: /users/:id; email: "+request.params.email); //variable name subject to change

  var u; //need a way to get user from email
  u["email"]=request.params.email; //TEMPorary fix

  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('results', {user:u});
});

//creates new user with id and shows results page
app.post('/users', function(request, response){
  console.log("POST request: /users; email: "+request.params.email); //variable name subject to change

    var u = {
          "email": request.params.email,
          "apikey": "ApIIIIkey"}
  dev.addUser(u, function(){
    console.log("user added");
  })
    
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('results', {user:u, message:"success"});
});
