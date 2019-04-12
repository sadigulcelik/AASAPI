var express = require('express');
var fs = require('fs');
var app = express();
var dat = require(__dirname +'/models/Data');
var all_users = dat.loadGoogle(function(all_users) {
    console.log(all_users);
  });
