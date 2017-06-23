var rest = require('./rest');
var cr = require('./cr');

var appId = cr.getAppId();
var Options = function(ids){
	return {
		host: 'api.worldoftanks.ru',
    	port: 443,
    	path: '/wot/account/info/?application_id='+appId+'&account_id=' + ids,
    	method: 'GET',
    	headers: {
    	    'Content-Type': 'application/json'
    	}
	}
}
var Statistic = function(obj){
	return {
		battles : '',
		wins : '',
		losses : ''
	}
}
var statMap = ['battles', 'wins', 'losses'];
var uData = {};
module.exports.getUserInfoById = function(id, callback){
	var options = new Options(id);
	rest.getJSON(options, function(statusCode, res) {
	    if(res && res.data && res.data[id]){
	    	callback(res.data[id]);
	    } else {
	    	callback(0)
	    }
	});
}
module.exports.updateOneUserData = function(user){
	var id = user.account_id;
	var clone = function(objFrom){
		var objTo = {};
		for(var i in objFrom){
			if(typeof(objFrom[i]) != 'object'){
				objTo[i] = objFrom[i];
			} else {
				objTo[i] = clone(objFrom[i]);
			}
		}
		return objTo;
	}
	if(!uData.hasOwnProperty(id)){
		uData[id] = {};
	}
	uData[id] = clone(user);
}
module.exports.updateuData = function(obj){
	for(var i in obj){
		this.updateOneUserData(obj[i]);
	}
}
module.exports.getUsersInfo = function(callback, list){
	if(!list){
		var list = [];
		for(var i in uData){
			list.push(i);
		}
	}
	var options = new Options(list.join(','));
	rest.getJSON(options, function(statusCode, res) {
	    callback(res);
	});
}
module.exports.checkUsers = function(callback){
	var self = this;
	this.getUsersInfo(function(res){
		var resp = [];
		if(res && res.data){
			for(var i in res.data){
				if(uData.hasOwnProperty(i)){
					console.log('%%% u',uData[i]['updated_at'],' res ',res.data[i]['updated_at'])
					if(uData[i]['updated_at'] != res.data[i]['updated_at']){
						console.log('battle!');
						var obj = {};
						for(var x in res.data[i]['statistics']){
							var stat = res.data[i]['statistics'][x];
							if(typeof(stat) == 'object' && x != 'frags'){
								console.log('b:', stat.battles, ':',uData[i]['statistics'][x]['battles']);

								if(stat['battles'] != uData[i]['statistics'][x]['battles']){
									obj[x] = {};
									statMap.forEach(function(stName){
										obj[x][stName] = stat[stName] - uData[i]['statistics'][x][stName];
									})
								}
							}
						}
						resp.push({account_id : i, obj : obj, newStat : res.data[i]});
					}
				} else {
					self.updateOneUserData(res.data(i));
				}
			}
		}
		callback(resp);
	})
}