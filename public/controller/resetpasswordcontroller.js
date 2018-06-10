angular.module('resetpassword',['registerServices'])

.controller('resetpassCtrl',function ($http,User,$routeParams) {
	
	var app = this;
	
	app.message = '';

	User.check($routeParams.token).then(function (data) {
		app.username = data.data.message.username;
	});

	app.reset = function (passworddata) {
		console.log(app.passworddata);
		if (app.passwords == 'undefined' && app.conpasswords == 'undefined' ) {
			app.message = 'password are not match';
		}else if(app.passworddata.passwords == app.passworddata.conpasswords){
			app.data = {
				password : app.passworddata.passwords,
				username: app.username,
			}

			User.reset(app.data).then(function (data2) {
				console.log(data2);
			})
		}else{
			app.message = 'password are not match';
		}
	};

});