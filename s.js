//PRS Showdown
//Authors: Sadi Gulcelik, Ayesha Ali
//Date: 1/18/19

//required packages
var express = require('express');
var fs = require('fs');
var favicon = require('serve-favicon');
var app = express();
var Developer = require(__dirname + '/models/Developer');
var dat = require(__dirname + '/models/Data');
var dev = require(__dirname + '/models/Developer');
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
var indexError;

var port = process.env.PORT || 3000;
app.listen(port, function () {
    //dataJS.log('Server started at '+ new Date()+', on port ' + port+'!');
});

//shows home page aka signup page
app.get('/', function (request, response) {
    console.log("GET request: /");
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('sign_up', {
        data: {
            message: "welcome"
        }
    });
});

app.get('/data', function (request, response) {
    console.log("GET request: /data");
    console.log(request.query.apikey);
    dev.validateAPIkey(request.query.apikey, function (isvalid) {
        if (isvalid) {
            dat.cases(function (data) {
                response.send(JSON.stringify(data))
            });
        } else {
            response.redirect('/')
        }
    });


});

//logs the user out and shows home page/signup page
app.get('/sign_up', function (request, response) {
    console.log("GET request: /logout");
    //log the user  out code here
    response.redirect('/');
});

//shows instructions page
app.get('/instructions', function (request, response) {
    console.log("GET request: /instructions");
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('instructions', {});
});

//shows results page for user with id, which shows api key and email
app.get('/users/:id', function (request, response) {
    console.log("GET request: /users/:id; email: " + request.params.email); //variable name subject to change

    var u; //need a way to get user from email
    Developer.getUser(request.params.email, function (user) {

        //NEED TO OPTIMIZE FOR OUR CODE

        res.status(200);
        res.setHeader('Content-Type', 'text/html')
        if (user_data.name == "" || user_data.password == "") { //empty forms
            console.log("Error: no input for forms");
            indexError = 1;
            res.render('instructions', {
                status: indexError
            });
        } else if (user_data.name == user.name && user_data.password == user.password) {
            console.log("Successful login.")
            res.render('results', {
                user: user,
                gameSelectError: gameSelectError
            });
        } else if (user_data.name == user.name && user_data.password != user.password) {
            console.log("Wrong password.")
            indexError = 2;
            res.render('instructions', {
                status: indexError
            });
        } else {
            username = "";
            password = "";
            indexError = 3;
            res.render('index', {
                user: user_data,
                status: indexError
            });
        }
    });
});

//creates new user with id and shows results page
app.post('/users', function (request, response) {
    dev.addUser(request.body.email, function (theuser) {
        console.log(theuser.email);
        console.log(theuser.apikey);
        if (theuser.apikey == "failure") {
            response.status(200);
            response.setHeader('Content-Type', 'text/html')
            response.render('results', {
                user: theuser,
                message: "failure"
            });

        } else {
            console.log("user added");
            response.status(200);
            response.setHeader('Content-Type', 'text/html')
            response.render('results', {
                user: theuser,
                message: "success"
            });
        }
    })


});
