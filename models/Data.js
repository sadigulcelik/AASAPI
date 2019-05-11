var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('../client_secret.json');
var doc = new GoogleSpreadsheet('17MplezRz9nYIw_jejd42ubSzDVCWdvVEGVGuhL0YQXE');
var {
    promisify
} = require('util')
var Promise = require('promise');

//determines type and accordingly returns appropriate filtered 2-d array
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
                if ((year === parseInt(unit[0]) | year == null | isNaN(year)) & (neighborhood === unit[1] | neighborhood == null) & (sex === unit[2] | sex == null) & (race === unit[3] | race == null)) {
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
                console.log(zipcode + " | " + unit[0]);
                if (zipcode === parseInt(unit[0]) | zipcode == null | isNaN(zipcode)) {
                    filteredData.push(unit);
                    console.log("added")
                } else {
                    console.log("not")
                }
            }
            callback(filteredData)
        });
    }
}

//returns 2d array of [year,neighborhood,sex,race,per100k,diagnosiscount]
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


//To maximize speed it is necessary to make multiple calls to the google spreadsheet at once (so as to divy up a large data request), though not so many as to overwhelm the server sending the request
exports.dist = async function accessSpreadsheet(zipcode) {
    await promisify(doc.useServiceAccountAuth)(creds)
    var info = await promisify(doc.getInfo)()
    console.log(`Loaded doc: ` + info.title + ` by ` + info.author.email)
    var sheet = info.worksheets[1];
    return new Promise(function (resolve, reject) {
        alldata = []
        for (var i = 2; i < 322; i += 40) {
            alldata.push(promisify(sheet.getCells)({
                'min-row': i,
                'max-row': i + 39,
                'min-col': 1,
                'max-col': 2,
                'return-empty': true
            }));
        }
        Promise.all(alldata).then(function (data) {
            out = [];
            for (var i = 0; i < data.length; i++) {
                for (var k = 0; k < 40; k++) {
                    out.push([data[i][2 * k].value, data[i][2 * k + 1].value]);
                }
            }
            // the splitting (as delimited by '~') facilitates getting requests with multiple zipcodes at once
            if (zipcode != null) {
                out = out.filter(function (element) {
                    return arr = zipcode.split('~').map(x => parseInt(x)).includes(parseInt(element[0]));
                });
            }
            resolve(out);
        });

    });
}

//To maximize speed it is necessary to make multiple calls to the google spreadsheet at once (so as to divy up a large data request), though not so many as to overwhelm the server sending the request
exports.cas = async function accessSpreadsheet(year, neighborhood, sex, race) {
    await promisify(doc.useServiceAccountAuth)(creds)
    var info = await promisify(doc.getInfo)()
    console.log(`Loaded doc: ` + info.title + ` by ` + info.author.email)
    var sheet = info.worksheets[0];
    return new Promise(function (resolve, reject) {
        alldata = []
        for (var i = 2; i < 2929; i += 183) {
            alldata.push(promisify(sheet.getCells)({
                'min-row': i,
                'max-row': i + 182,
                'min-col': 1,
                'max-col': 6,
                'return-empty': true
            }));
        }
        Promise.all(alldata).then(function (data) {
            out = [];
            for (var i = 0; i < data.length; i++) {
                for (var k = 0; k < 183; k++) {
                    out.push([data[i][6 * k].value, data[i][6 * k + 1].value, data[i][6 * k + 2].value, data[i][6 * k + 3].value, data[i][6 * k + 4].value, data[i][6 * k + 5].value]);
                }
            }
            // the splitting (as delimited by the '~') facilitates getting requests with multiple years, neighborhoods, sexes, or races  at once
            if (year != null) {
                out = out.filter(function (element) {
                    return arr = year.split('~').map(x => parseInt(x)).includes(parseInt(element[0]));
                });
            }
            if (neighborhood != null) {
                out = out.filter(function (element) {
                    return neighborhood.split('~').includes(element[1]);
                });
            }
            if (sex != null) {
                out = out.filter(function (element) {
                    return sex.split('~').includes(element[2]);
                });
            }
            if (race != null) {
                out = out.filter(function (element) {
                    return race.split('~').includes(element[3]);
                });
            }
            /*if(true){
            if (neighborhood != null) {
                out = out.filter(function (element) {
                    return neighborhood.split(',').map(x => x.trim().toLowerCase()).includes(element[1].trim().toLowerCase());
                });
            }
            console.log(out);
            if (sex != null) {
                out = out.filter(function (element) {
                    return sex.split(',').map(x => x.trim().toLowerCase()).includes(element[2].trim().toLowerCase());
                });
            }
            console.log(out);
            if (race != null) {
                out = out.filter(function (element) {
                    return race.split(',').map(x => x.trim().toLowerCase()).includes(element[3].trim().toLowerCase());
                });
            }}*/
            resolve(out);
        });

    });

}
