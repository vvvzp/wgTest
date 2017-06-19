var rest = require('./rest');
var user = require('./user');
var fire = require('./fire');

var check = function(){
	user.checkUsers(function(res){
		console.log("@! ", res.length);
		if(res && res.length){
			res.forEach(function(userObj){
				var _time = (new Date()).getTime();
				var obj = {
					battles : {}
				};
				obj.battles[_time] = userObj.obj;
				console.log("## ", obj)
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
				console.log(res)
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
// run once for create users structure
// which must have stat
// request user info and save to fire
/*user.getUserInfoById('353999', function(res){
	var newUser = new GetUserObject(res);
	//console.log(newUser)
	fire.updateUserDataFull(res['account_id'], res);
})*/
