angular.module('logincontroller',['authServices'])

.controller('lgnCtrl',function ($http,Auth,AuthToken,$location,$timeout,$rootScope) {

	var app = this;

	app.loadme = false;

	$rootScope.$on('$routeChangeStart',function(){
		if (Auth.isLoggedin()) {
			app.log = true;
			Auth.getUser().then(function(data){
				console.log(data.data.username);
				app.username = data.data.username;
				app.email = data.data.email;
			});
			app.loadme = true;
		}else{
			app.log = false;
			app.username = '';
			app.loadme = true;
		}
	});

	this.authentication = function(logindata){
		if (app.logindata == undefined || app.logindata.username == null || app.logindata.password == null) {
			app.msg = 'please provide all the logindata';
		}else{
			Auth.check(app.logindata).then(function (data){
				app.msg = data.data.message;
			});
		}
	}

	this.logout = function(){
		AuthToken.setToken();
		$location.path('/logout');
		$timeout( function(){ $location.path('/') } , 3000);
	}

});