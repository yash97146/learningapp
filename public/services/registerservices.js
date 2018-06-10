angular.module('registerServices',[])
.factory('User',function ($http) {
	userFactory = {};

	userFactory.create = function(regdata){
		return $http.post('/back-end/users',regdata);
	}

	//User.activate(token)
	userFactory.activate = function (token) {
		return $http.put('/back-end/confirm/' + token);
	}

	userFactory.sendUsername = function(forgotdata){
		return $http.get('/back-end/forgotusernmae/' + forgotdata);
	}

	userFactory.check = function (token) {
		return $http.get('/back-end/check-user/' + token);
	}

	userFactory.reset = function (data) {
		return $http.post('/back-end/reset',data);
	}

	return userFactory;
});