var express = require('express');
var fs = require("fs");
var router = express.Router();
var dataJS = require('../models/Data');
var Developer = require('../models')
//var jobJS = require('../models/jobprogram');

router.get('/neighborhoodsearch', function(request, response) {
  var key = request.query.apikey;
  var data={
    name: request.query.name,
    neighborhood: request.query.neighborhood,
    //diagnosis: request.query.diagnosiscount,
  };

  //need a function in one of models called
  Developer.getDiagnosis();
  //that takes neighborhood and returns # of diagnoses in it

})

router.get('/condomsearch', function(request, response) {
  var key = request.query.apikey;
  var data={
    neighborhood: request.query.neighborhood,
    location: request.query.location,
  };

  //need function in models called
  Developer.getCondoms();
  //which get input a neighborhood and outputs the or a few of the closest
  //condom distribution centers

})
