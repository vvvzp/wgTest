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
var Statistic = function(){
	return {
		battles : '',
		wins : '',
		losses : ''
	}
}
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
// return obj, contain users with created stat
module.exports.updateuData = function(obj, callback){

//rewrite !!!!!!

	var resp = [];
	for(var i in obj){
		console.log(i)
		if(!uData.hasOwnProperty(i)){
			uData[i] = {};
		}
		if(obj[i].hasOwnProperty('stat')){
			if(!uData[i].hasOwnProperty('stat')){
				uData[i]['stat'] = new Statistic();
			}
			for(var x in obj[i]['stat']){
				uData[i]['stat'][x] = obj[i]['stat'][x];
			}
		} else {
			console.log('no stat')
			resp.push(obj[i]);
		}
	}
	if(callback) {
		callback(resp);
	}
	// call from wg.js and save to uData all entries (init)
}
module.exports.getUsersInfo = function(callback){
	var list = [];
	for(var i in uData){
		list.push(i);
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
					console.log('%%%',uData[i]['updated_at'],res.data[i]['updated_at'])
					if(uData[i]['updated_at'] != res.data[i]['updated_at']){
						console.log('battle!');
						for(x in res.data[i]){
							if(typeof(res.data[i][x]) != "object"){
								uData[i][x] = res.data[i][x];
							}
						}
						//resp.push(self.getResult(uData[i], res.data[i]['statistics']['all']))
					}
				}
			}
		}
		callback(resp);
	})
}
var getResult = function(userInfo, newStat){
	var obj = {
		userInfo : userInfo,
		result : {}
	};
	for(var prop in userInfo['stat']){
		if(userInfo['stat'][prop] != newStat[prop]){
			obj['result'][prop] = newStat[prop] - userInfo['stat'][prop];
		} else {
			obj['result'][prop] = 0;
		}
	}
	return obj;
}