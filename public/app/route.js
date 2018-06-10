var app = angular.module('appRoute',['ngRoute'])
.config(function ($routeProvider,$locationProvider) {
	
	$routeProvider.when('/',{
		templateUrl: 'pages/home.html'
	})
	.when('/about',{
		templateUrl: 'pages/about.html',
	})
	.when('/register',{
		templateUrl: 'pages/register.html',
		controller: 'regCtrl',
		controllerAs: 'register',
		authentication: false
	})
	.when('/profile',{
		templateUrl: 'pages/profile.html',
		authentication: true
	})
	.when('/login',{
		templateUrl: 'pages/login.html',
		controller: 'lgnCtrl',
		controllerAs: 'login',
		authentication: false
	})
	.when('/logout',{
		templateUrl: 'pages/logout.html',
		authentication: true
	})
	.when('/confirm/:emailtoken',{
		templateUrl: 'pages/email/active.html',
		controller: 'emailCtrl',
		controllerAs: 'email',
		authentication: false
	})
	.when('/forgotusername',{
		templateUrl: 'pages/email/forgotusername.html',
		controller: 'forgotusernameCtrl',
		controllerAs: 'forgot',
		authentication: false
	})
	.when('/forgotpassword',{
		templateUrl: 'pages/email/forgotpassword.html',
		controller: 'forgotpassCtrl',
		controllerAs: 'pass',
		authentication: false
	})
	.when('/reset/:token',{
		templateUrl: 'pages/email/resetpassword.html',
		controller: 'resetpassCtrl',
		controllerAs: 'password',
		authentication: false
	})
	.otherwise({ redirectTo: '/'});

	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
});


app.run(['$rootScope','Auth','$location',function($rootScope,Auth,$location){
	$rootScope.$on('$routeChangeStart',function(event,next,current){
		if (next.$$route.authentication == true) {
			if (!Auth.isLoggedin()) {
				event.preventDefault();
				$location.path('/');
			}
		}else if (next.$$route.authentication == false){
			if (Auth.isLoggedin()) {
				event.preventDefault();
				$location.path('/profile');
			}
		}
	});
}]);