angular.module('emailcontroller',['registerServices'])

.controller('emailCtrl',function ($http,User,$routeParams) {

	var app = this;

	app.error = false;
	app.success = false
	app.message = '';

	User.activate($routeParams.emailtoken).then(function (data) {
		if (data.data.success) {
			app.success = true;
		}else{
			app.error = true;
		}
		app.message = data.data.message;
	});
});