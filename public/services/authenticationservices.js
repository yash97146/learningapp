angular.module('authServices',[])
.factory('Auth',function ($http,AuthToken) {
	var authFactory = {};

	authFactory.check = function(data){
		return $http.post('/back-end/auth',data).then(function(data){
			AuthToken.setToken(data.data.token);
			return data;
		});
	};

	authFactory.isLoggedin = function(){
		if (AuthToken.getToken()) {
			return true;
		}else{
			return false;
		}
	};

	authFactory.getUser = function(){
		if(AuthToken.getToken()){
			return $http.post('/back-end/me');
		}else{
			$q.reject({ message : 'User has no token'});
		}
	};

	return authFactory;
})
.factory('AuthToken',function($window){
	var authTokenFactory = {};

	authTokenFactory.setToken = function(token){
		if (token) {
			$window.localStorage.setItem('token', token);
		}else{
			$window.localStorage.removeItem('token');
		}
	};

	authTokenFactory.getToken = function(){
		return $window.localStorage.getItem('token');
	}

	return authTokenFactory;

})

.factory('AuthInterceptors',function(AuthToken){
	var authInterceptors = {};

	authInterceptors.request = function(config){

		var token = AuthToken.getToken();

		if (token) {
			config.headers['x-access-token'] = token;
		}

		return config;
	}

	return authInterceptors;
});