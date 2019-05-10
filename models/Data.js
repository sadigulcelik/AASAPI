var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('../client_secret.json');
var doc = new GoogleSpreadsheet('17MplezRz9nYIw_jejd42ubSzDVCWdvVEGVGuhL0YQXE');

exports.filter = function (type, zipcode, year, neighborhood, sex, race, callback) {
    year = parseInt(year);
    zipcode = parseInt(zipcode);
    console.log(type)
    var filteredData = [];
    if (type == "cases") {
        console.log("hi");
        exports.cases(function (data) {

            for (var i = 0; i < data.length; i++) {
                unit = data[i];
                if ((year === parseInt(unit[0]) | year == null| isNaN(year)) & (neighborhood === unit[1] | neighborhood == null) & (sex === unit[2] | sex == null) & (race === unit[3] | race == null)) {
                    filteredData.push(unit);
                    console.log("added")
                } else {
                    console.log("not")
                }
            }
            callback(filteredData)
        });
    } else if (type == "distribution") {
        exports.distribution(function (data) {
            filteredData = [];
            for (var i = 0; i < data.length; i++) {
                unit = data[i];
                console.log(zipcode+" | " +unit[0]);
                if (zipcode === parseInt(unit[0]) | zipcode == null| isNaN(zipcode)) {
                    filteredData.push(unit);
                    console.log("added")
                }
                else{
                    console.log("not")
                }
            }
            callback(filteredData)
        });
    }
}


exports.cases = function (callback) {
    out = [[]];
    doc.useServiceAccountAuth(creds, function (err) {
        doc.getInfo(function (err, info) {
            sheet = info.worksheets[0];

            sheet.getCells({
                'min-row': 2,
                'min-col': 1,
                'max-col': 6,
                'return-empty': true
            }, function (err, cells) {
                for (var i = 0; i < cells.length / 6; i += 1) {
                    out[i] = []
                    for (var k = 0; k < 6; k += 1) {
                        out[i].push(cells[6 * i + k].value);
                    }
                }
                callback(out);
            });

        });
    });
}

//returns 2d array of zipcodes and addresses, in that order
//so for example, arrray[ROW 0-][COLUMN 0-1]
exports.distribution = function (callback) {
    out = [[]];
    doc.useServiceAccountAuth(creds, function (err) {
        doc.getInfo(function (err, info) {
            sheet = info.worksheets[1];

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

//returns 2d array of zipcodes and addresses, in that order
//so for example, arrray[ROW 0-][COLUMN 0-1]
exports.fastDistribution = function (callback) {
    minentry=2;
    maxentry=321;
    divisions=30;
    split=math.ceil((321-2)/30);

    doc.useServiceAccountAuth(creds, function (err) {
        doc.getInfo(function (err, info) {
            sheet = info.worksheets[1];

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
    Promise.all([dist, cas]).then(function (info) {
                console.log(dist);
                console.log(cas);
                response.render('main', {
                    page: request.url,
                    info: info,
                    title: "Main"
                });
            });
}
