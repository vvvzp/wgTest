MainModule
.service('dataService', ['$q'
	, function(){
		var rotateArr = ['nickname','param.percent','param.battles','param.lastBattle'];
		return {
			getUserList : function(){
				var list = localStorage.getItem('userlist');
				if(list == null){
					localStorage.setItem('userlist', '');
					list = '';
				}
				return list.split(',');
			},
			addUser : function(userid){
				console.log(userid)
				var list = localStorage.getItem('userlist')+'';
				if(list.indexOf(userid) > -1){
					console.log('user present')
				} else {
					if(list == ''){
						list = userid;
					} else {
						list = list + "," + userid;	
					}
					localStorage.setItem('userlist', list);
				}
			},
			deleteUsers : function(users){
				var list = localStorage.getItem('userlist').split(',');
				var del = function(id){
					console.log(id);
					var i = -1;
					list.forEach(function(item, indx){
						if(item == id){
							i = indx;
						}
					})
					list.splice(i ,1);
				}
				if(users && users.length){
					users.forEach(function(userid){
						del(userid);
					})
				}
				localStorage.setItem('userlist', list.join(','));
			},
			getNextSort : function(sort){
				var index = rotateArr.indexOf(sort);
				if(index != -1){
					if(++index > (rotateArr.length-1) ){
						index = 0;
					}
					console.log(rotateArr[index])
					return rotateArr[index];
				}
			},
			getSortIndex : function(val){
				return rotateArr.indexOf(val);
			},
			getSortType : function(){
				var val = localStorage.getItem('sortType');
				if(rotateArr.indexOf(val) > -1){
					return val;
				} else {
					return rotateArr[0];
				}
				return localStorage.getItem('sortType');
			},
			setSortType : function(val){
				localStorage.setItem('sortType', val);
			}
		}
}]);