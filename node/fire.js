var firebase = require('firebase');
var cr = require('./cr');

var config = cr.getConfig();
firebase.initializeApp(config);
var database = firebase.database();

module.exports.setLastUpdateTime = function(time){
	var _time = time || (new Date()).getTime();
	console.log(_time)
	database.ref().child("WG/lastUpdatedTime").set(_time);
}
module.exports.updateUserData = function(data){
	firebase.database().ref().child("WG/Users/"+data.user).update(data.obj);
}
module.exports.updateUserDataFull = function(userId, userData){
	firebase.database().ref().child("WG/Users/"+userId).update(userData);
}
module.exports.getUsersData = function(callback){
	database.ref().child("WG/Users").once('value').then(function(res){
		callback(res.val());
	});
}
module.exports.getNewUsers = function(callback){
	database.ref().child("WG/addUser").once('value').then(function(res){
		callback(res.val());
	});
}
module.exports.clearRequestFieldForAddNewUsers = function(){
	database.ref().child("WG/addUser").set('');
}
module.exports.addListener = function(item, callback){
	database.ref().child("WG/"+item).on('value', function(res){
		console.log(res)
	})
}