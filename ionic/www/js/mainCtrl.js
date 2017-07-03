MainModule
.controller('mainCtrl', function($scope, userService, fireService, dataService){
	$scope.Visible = {
		list : true,
		add : false,
		remove : false,
		userStat : false,
		loading : false
	};
	$scope.users = [];
	$scope.page = {
		users:[],
		sort: 'nickname',
		sName: ''
	};
	$scope.changeVisible = function(section){
		$scope.Visible.list = false;
		$scope.Visible.add = false;
		$scope.Visible.remove = false;
		$scope.Visible.userStat = false;
		$scope.Visible[section] = true;
		$scope.Visible.delAllButton = false;
		$scope.page.foundUsers = [];
		if(section == 'remove'){
			userService.removeSelected($scope.page.users);	
		}

	};
	var setColorForFooter = function(){
		$scope.page.fbtn = [];
		var indx = dataService.getSortIndex($scope.page.sort);
		$scope.page.fbtn[indx] = 'button-positive';
	}
	$scope.changeSort = function(val, reverse){
		if(reverse === undefined){
			reverse = true;
		}
		$scope.page.reverse = reverse;
		if(val != ''){
			$scope.page.sort = val;
		} else {
			$scope.page.sort = dataService.getNextSort($scope.page.sort);
			if($scope.page.sort == 'nickname'){
				$scope.page.reverse = false;
			}
		}
		dataService.setSortType($scope.page.sort);
		setColorForFooter();
	}
	$scope.deleteSelected = function(users){
		var list = userService.getSelectedUsers(users);
		if(list && list.length){
			userService.getDeleteAnswer($scope, list.length).then(function(res){
				if(res == true){
					dataService.deleteUsers(list);
					document.location.reload();
				} else {
					userService.removeSelected($scope.page.users);
					$scope.changeVisible('list');
				}
			})	
		}
	}
	$scope.userToggle = function(users){
		if(userService.getSelectedUsers(users).length > 0){
			$scope.Visible.delAllButton = true;
		} else {
			$scope.Visible.delAllButton = false;	
		}
	}
	$scope.showUserStat = function(user){
		console.log(user)
		$scope.page.userStat = user;
		$scope.changeVisible('userStat');
	}
	$scope.searchUser = function(userName){
		if(userName != ''){
			console.log(userName);
			userService.getUser(userName).then(function(res){
				if(res && res.length){
					$scope.page.sName = '';
					$scope.page.foundUsers = res;
				}
			})
		}
	}
	var addUser = function(user){
		userService.updateView($scope.page.users, user);
		setTimeout(function(){
			$scope.$apply();	
		},10)
	}
	$scope.userSelected = function(user){
		$scope.changeVisible('list');
		fireService.sendNewUser(user);
		fireService.addListener("/Users/" + user.account_id, function(user){
			if(user && user.account_id){
				dataService.addUser(user.account_id);
				addUser(user);
			}
		})
	};
	var database = fireService.init();
	var userList = dataService.getUserList();
	console.log(userList)
	if(userList && userList.length && userList != ''){
		$scope.Visible.loading = true;
		userList.forEach(function(userid){
			if(userid != ''){
				fireService.addListener("/Users/" + userid, function(user){
					$scope.Visible.loading = false;
					addUser(user);
				})
			}
		})
	}
	$scope.changeSort(dataService.getSortType());
	console.log($scope.page);
	fireService.addListener('/lastUpdatedTime', function(val){
		$scope.page.serverLastUpdate = val;
		$scope.$apply();
	})
});