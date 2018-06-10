angular.module('forgotpassword',['registerServices'])

.controller('forgotpassCtrl',function (User) {
	
	var app = this;
	
	app.resetPass = function (resetdata) {
		console.log(app.resetdata);
	}

});