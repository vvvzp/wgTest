var rest = require('./rest');
var user = require('./user');
var fire = require('./fire');

var check = function(){
	fire.setLastUpdateTime();
	user.checkUsers(function(res){
		console.log("@! ", res.length);
		if(res && res.length){
			res.forEach(function(userObj){
				var _time = (new Date()).getTime();
				var obj = {
					battles : {}
				};
				obj.battles[_time] = userObj.obj;
				fire.updateUserDataFull(userObj['account_id']+'/battles', obj.battles);
				fire.updateUserDataFull(userObj['account_id'], userObj.newStat);
				user.updateOneUserData(userObj.newStat);
			})
		}
	});
};
var checkAddNewUsers = function(){
	fire.getNewUsers(function(res){
		if(res && res.length){
			var users = res.split(',');
			user.getUsersInfo(function(res){
				if(res.meta.count > 0){
					for(var x in res.data){
						fire.updateUserDataFull(res.data[x]['account_id'], res.data[x]);
						user.updateOneUserData(res.data[x]);
					}
					fire.clearRequestFieldForAddNewUsers();
				}
			}, users)
		}
	})
};
fire.getUsersData(function(users){
	user.updateuData(users);
	check();
	var qu = 0;
	setInterval(function(){
		if(++qu > 60){
			qu = 0;
			console.log('. 10 min')
		}
		check();
		//checkAddNewUsers();
	}, 10000);
});
checkAddNewUsers();
fire.addListener('addUser', function(res){
	console.log(res);
})