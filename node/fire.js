var firebase = require('firebase');
var cr = require('./cr');

var config = cr.getConfig();
firebase.initializeApp(config);
var database = firebase.database();

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
