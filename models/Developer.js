var fs = require("fs");
var Data = require(__dirname+'/data');


exports.getUser = function(user_id, callback) {
  var user = createBlankUser();
  var all_users = Data.loadGoogle(1, function(all_users) {
    for(var i=0; i<all_users.length; i++){
      if(all_users[i].name==user_id.trim()){
        user = all_users[i];
        break;
      }
    }
    console.log("Users.getUser, got user "+user_id);
    callback(user);
  });
}

exports.updateUser = function(user_id, updatedData, callback) { //takes in username, an array of userdata in standard order, callback function and updates user with username if found with userdata
  console.log("Updating user: "+user_id);
  exports.getUser(user_id, function(user) {
    if(user_id!=updatedData[0]||user.password!=updatedData[1]||user.firstname!=updatedData[10]||user.lastname!=updatedData[11]) {
      updatedData[13]=getDate();
    }
  });
  console.log(updatedData);
  Data.updateRow(0, user_id, updatedData, callback);
}

exports.createUser = function(user_id, user_password, first_name, last_name,callback) {
    var result = true;
    if (user_id==null||user_id==""||user_password==null||user_password==""||first_name==null||first_name==""||last_name==null||last_name==""){
        console.log("Users.createUser, null input.");
        result= false;
    }
    if (result){
        date=getDate();
        console.log("Users.createUser, User created!");
        var new_user_data = {
          "name": user_id,
          "password": user_password,
          "games_played": 0,
          "games_won": 0,
          "games_tied": 0,
          "games_lost": 0,
          "rock": 0,
          "paper": 0,
          "scissors": 0,
          "win_rate": 0,
          "first_name": first_name,
          "last_name": last_name,
          "date_of_creation": date,
          "date_of_latest_update": date
      }
      Data.createRow(new_user_data, function(){
          callback(true);});
  }
  else{
     callback(false);
  }
}

exports.deleteUser = function(user_id, callback) {
  console.log("Deleting user: "+user_id);
  Data.deleteRow(user_id, callback)
}

var createBlankUser = function(){
  date=getDate();
  var new_user = {
    "name": "blankuser",
    "password": "blankuser",
    "games_played": 0,
    "games_won": 0,
    "games_tied": 0,
    "games_lost": 0,
    "rock": 0,
    "paper": 0,
    "scissors": 0,
    "win_rate": 0,
    "first_name": "blankuser",
    "last_name": "blankuser",
    "date_of_creation": 0,
    "date_of_latest_update": 0
  }
  return new_user;
}

function writeCSVfromSplitCells(csv, csv_data){
  console.log("Users.writeCSVfromSplitCells, input:"+csv_data)
  // console.log(csv_data)
  var players_data_string = "name,password,games played,games won,games tied,games lost,rock,paper,scissors,winrate\n";
  for(i=0; i<csv_data.length;i++){
    players_data_string+=csv_data[i].join(",");
    if (i!=csv_data.length-1){
        players_data_string[i]+="\n";
    }
  }
  fs.writeFile(csv,players_data_string,'utf8',function(){});
}
function writeCSVfromNoSplit(csv, csv_data){
  console.log("Users.writeCSVfromNoSplit, input:"+csv_data)
  fs.writeFile(csv,csv_data,'utf8',function(){});
}

exports.getDate=function(){
    return getDate();
}
function getDate(){
    var date=new Date();
    var months=["January","February","March","April", "May", "June","July","August","September", "October", "November","December"];
    var month=months[date.getMonth()];
    return ((date.getMonth()+1)+"/"+date.getDate()+"/"+ date.getFullYear()+";  "+date.getHours()+":"+adjust(date.getMinutes())+":"+adjust(date.getSeconds()));
}
function adjust(n){
   return ("0" + n).slice(-2);
}
