// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var MainModule = angular.module('main', ['ionic', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('list', {
      url: '/list',
        templateUrl: '../html/list.html',
        controller: 'mainCtrl'
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/list');
})
//.constant('FirebaseUrl', 'https://zptest-73acd.firebaseio.com')
//.service('rootRef', ['https://zptest-73acd.firebaseio.com', Firebase])