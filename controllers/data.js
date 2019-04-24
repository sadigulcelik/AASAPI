var express = require('express');
var fs = require("fs");
var router = express.Router();
var dataJS = require('../models/Data');
var Developer = require('../models')
//var jobJS = require('../models/jobprogram');

router.get('/benefitsearch', function(request, response) {
  var key = request.query.apikey,
  var data={
    name: request.query.name,
    type: request.query.type,
    pop: request.query.pop,
    contact: request.query.contact,
    desc: request.query.desc,
  };

  jobJS.paramSelec(1,data,key,function(json) {
    response.json(json);
  })

})

router.get('/jobsearch', function(request, response) {
  var key = request.query.apikey;
  var data={
    agency: request.query.agency,
    title: request.query.title,
    category: request.query.category,
    service: request.query.service,
    location: request.query.location,
  };

  jobJS.paramSelec(1,data,key,function(json) {
    response.json(json);
  });

})
