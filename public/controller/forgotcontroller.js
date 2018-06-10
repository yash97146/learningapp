angular.module('forgotcontroller',['registerServices'])

.controller('forgotusernameCtrl',function (User) {
	var app = this;
	
	app.sendUsername = function(forgotdata){
		console.log(app.forgotdata);
		User.sendUsername(app.forgotdata.email).then(function(data){
			console.log(data);
		});
	};
});