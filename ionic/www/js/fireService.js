MainModule
.service('fireService', ['$q'
	, function($q){
    	var config = setting.fireOptions;
    	var database;
		return {
			init : function(){
				firebase.initializeApp(config);
    			database = firebase.database();
    			return database;
			},
			sendNewUser : function(user){
				database.ref().child("WG/addUser").set(user.account_id+"");
			},
			addListener : function(item, callback){
				database.ref().child("WG/"+item).on('value', function(res){
					if(res.val() != ''){
						callback(res.val());
					}
				})
			},
			removeListener : function(item){
				database.ref().child("WG/Users/"+item).off();
			}
		}
}]);