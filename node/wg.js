var rest = require('./rest');
var user = require('./user');
var fire = require('./fire');

// no used
var GetUserObject = function(user){
	console.log(typeof user['updated_at'])
	return {
		user : user['account_id'],
		obj : {
			nickname : user['nickname'],
			logout : user['logout_at'],
			last_battle_time : user['last_battle_time'],
			updated_at : user['updated_at'],
			battles : {},
			stat : {
				battles : user['statistics']['all']['battles'],
				wins : user['statistics']['all']['wins'],
				losses : user['statistics']['all']['losses']
			}
		}
	}
}
var check = function(){
	user.checkUsers(function(res){
		if(res && res.length){
			res.forEach(function(userObj){
				var _time = (new Date()).getTime();
				var obj = {
					user : user['account_id'],
					obj : {
						battles : {}
					}
				};
				obj.obj.battles[_time] = user['statistics']['all']['battles'];
				console.log("## ",obj)
				//fire.updateUserData();
			})
		}
	});
}
fire.getUsersData(function(users){
	user.updateuData(users, function(res){
		// nothing to do, only for debuging
		if(res && res.length){
			console.log('user(s) without stat!!!')
			res.forEach(function(user, index){
				//console.log(index, "#", user)
			})
		}
		// end debug
		check();
		var qu = 0;
		setInterval(function(){
			if(++qu > 60){
				qu = 0;
				console.log('. 10 min')
			}
			check();
		}, 10000);
	})
});
// run once for create users structure
// which must have stat
// request user info and save to fire
/*user.getUserInfoById('353999', function(res){
	var newUser = new GetUserObject(res);
	//console.log(newUser)
	fire.updateUserDataFull(res['account_id'], res);
})*/
