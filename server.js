var express = require('express');
var fs = require('fs');
var app = express();
var dat = require(__dirname +'/models/Data');
var dev = require(__dirname +'/models/Developer');
var all_users = dat.cases(function(all_users) {
    console.log(all_users[0]);
  });
var new_obj = {
          "email": "what@whicmail.com",
          "apikey": "ApIIIIkey"}
dev.addUser(new_obj, function(){
    console.log("yes");
})
