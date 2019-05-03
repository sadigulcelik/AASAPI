var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('../client_secret.json');
var doc = new GoogleSpreadsheet('1wlcEPqa0JQTymCvavbXsbrNCfpTW0M79Hi-BrPnBJuo');

exports.both = function (callback) {
    out = [[]];
    doc.useServiceAccountAuth(creds, function (err) {
        doc.getInfo(function (err, info) {
            sheet = info.worksheets[0];

            sheet.getCells({
                'min-row': 2,
                'min-col': 1,
                'max-col': 2,
                'return-empty': true
            }, function (err, cells) {
                for (var i = 0; i < cells.length / 2; i += 1) {
                    out[i] = []
                    for (var k = 0; k < 2; k += 1) {
                        out[i].push(cells[2 * i + k].value);
                    }
                }
                callback(out);
            });

        });
    });
}
isOpen = function (email, callback) {
    var emailList = exports.emails(function (emailList) {
        var isopen = true;
        for (var i = 0; i < emailList.length; i += 1) {
            if (emailList[i] == email) {
                isopen = false;

            }
        }
        callback(isopen);
    });
}
//Updates a row
exports.addUser = function (theEmail, callback) {
    isOpen(theEmail, function (open) {
        console.log(open);

        if (open) {
            str = ""
            for (var i = 0; i < 8; i++) {
                num = Math.floor(Math.random() * 91 + 35);
                if (num == 92) {
                    num = 33;
                }
                if (num == 61) {
                    num = 126;
                }
                str += (String.fromCharCode(num));
            }

            obj = {
                "email": theEmail,
                "apikey": str
            }

            doc.useServiceAccountAuth(creds, function (err) {
                doc.addRow(1, obj, function () {
                    callback(obj);
                });
            });
        } else {
            obj = {
                "email": "nope",
                "apikey": "failure"
            }
            callback(obj);
        }
    });
}
exports.emails = function (callback) {
    out = [];
    doc.useServiceAccountAuth(creds, function (err) {
        doc.getInfo(function (err, info) {
            sheet = info.worksheets[0];

            sheet.getCells({
                'min-row': 2,
                'min-col': 1,
                'max-col': 1,
                'return-empty': true
            }, function (err, cells) {
                for (var i = 0; i < cells.length; i += 1) {
                    out.push(cells[i].value)
                }
                callback(out);
            });

        });
    });
}
