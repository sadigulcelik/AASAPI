var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('../client_secret.json');
var doc = new GoogleSpreadsheet('17MplezRz9nYIw_jejd42ubSzDVCWdvVEGVGuhL0YQXE');

exports.cases = function(callback) {
  out=[[]];
  doc.useServiceAccountAuth(creds, function (err) {
     doc.getInfo(function(err,info){
        sheet=info.worksheets[0];

        sheet.getCells({
        'min-row':1,
        'min-col': 1,
        'max-col': 6,
        'return-empty': true}, function(err, cells) {
            for(var i=0; i<cells.length/6;i+=1){
                out[i]=[]
            for(var k=0; k<6;k+=1){
            out[i].push(cells[6*i+k].value);
            }
            }
            callback(out);
      });

      });
  });
}

//returns 2d array of zipcodes and addresses, in that order
//so for example, arrray[ROW 0-][COLUMN 0-1]
exports.distribution = function(callback) { //sadi you need to make comments
  //that SAY WHAT THE FUNCTION DOES
  out=[[]];
  doc.useServiceAccountAuth(creds, function (err) {
     doc.getInfo(function(err,info){
        sheet=info.worksheets[1];

        sheet.getCells({
        'min-row':1,
        'min-col': 1,
        'max-col': 2,
        'return-empty': true}, function(err, cells) {
            for(var i=0; i<cells.length/2;i+=1){
                out[i]=[]
            for(var k=0; k<2;k+=1){
            out[i].push(cells[2*i+k].value);
            }
            }
            callback(out);
      });

      });
  });
}
