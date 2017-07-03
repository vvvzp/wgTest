MainModule
.service('userService', ['$q', '$ionicPopup', '$http'
	, function($q, $ionicPopup, $http){
    	var app_id = setting.appId;
    	var req = {
			method: 'GET',
			url: 'https://api.worldoftanks.ru/wot/account/list/?application_id=' + app_id,
		}
		var monthMap = {0:'Jan', 1:'Feb', 2:'March', 3:'April', 4:'May', 5:'June', 6:'July', 7:'August', 8:'Sept', 9:'Oct', 10:'Nov', 11:'Dec'};
		return {
			getUser : function(userName, callback){
				var d = $q.defer();
				req.url = req.url + '&search= '+userName;
				$http(req).
            		then(function success(response){
            			if(response.data && response.data.data && response.data.data.length){
            				d.resolve(response.data.data);
            			}
            			d.resolve();
            		});
				return d.promise;
			},
			performUser : function(user){
				var stat = user.statistics['all'];
				user['param'] = {};
				user['param']['percent'] = (stat.wins/(stat.battles/100)).toFixed(2);
				user['param']['battles'] = Math.round(stat.battles/1000);
				user['param']['battlesFull'] = stat.battles;
				user['param']['lastBattle'] = user['last_battle_time']*1000;
				if(user.battles){
					user['dailyBattles'] = {};
					for(var i in user.battles){
						user.battles[i]['time'] = i;
						user.battles[i]['percent'] = (user.battles[i]['all']['wins']/(user.battles[i]['all']['battles']/100)).toFixed(0);
						var p = stat['battles']/100;
						var diff = user.battles[i]['all']['wins'] - user.battles[i]['all']['losses'] - (user.battles[i]['all']['battles'] - user.battles[i]['all']['wins'] - user.battles[i]['all']['losses']);
						user.battles[i]['uppercent'] = (diff/p).toFixed(3);
						// make daily battles
						var day = monthMap[(new Date(i*1).getMonth())] + "_" + (new Date(i*1).getDate());
						if(!user['dailyBattles'][day]){
							user['dailyBattles'][day] = {};
						}
					}
				}
				return user;
			},
			updateView : function(arr, _user){
				var user = this.performUser(_user);
				var flag = true;
				if(arr && arr.length){
					arr.forEach(function(item){
						if(item['account_id'] == user['account_id']){
							console.log('save');
							for (var x in user['battles']){
								item['battles'][x] = user['battles'][x];
							}
							if(!item['param']){
								item['param'] = {};
							}
							for (var x in user['param']){
								item['param'][x] = user['param'][x];
							}
							flag = false;
						}
					})
				}
				if(flag){
					arr.push(user);	
				}
			},
			getSelectedUsers : function(users){
				var arr = [];
				users.forEach(function(user){
					if(user.check && user.check == true){
						arr.push(user.account_id);
					}
				})
				return arr;
			},
			removeSelected : function(users){
				users.forEach(function(user){
					user.check = false;
				})
			},
			getDeleteAnswer : function(scope, count){
				var d = $q.defer();
				$ionicPopup.confirm({
     				title: 'Confirm delete',
     				template: 'Are you sure delete ' + count + ' users from watch list ?'
   				}).then(function(res){
   					d.resolve(res);
   				});
				return d.promise;
			}
		}
}]);