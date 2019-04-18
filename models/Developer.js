var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('../client_secret.json');
var doc = new GoogleSpreadsheet('1wlcEPqa0JQTymCvavbXsbrNCfpTW0M79Hi-BrPnBJuo');

exports.both = function(callback) {
  out=[[]];
  doc.useServiceAccountAuth(creds, function (err) {
     doc.getInfo(function(err,info){
        sheet=info.worksheets[0];
            
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

//Updates a row
exports.addUser=function(obj, callback){
  var sheet;
  doc.useServiceAccountAuth(creds, function (err) {
    doc.addRow(1, obj, function(){
      callback();
    });
  });
}
