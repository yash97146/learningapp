angular.module('registercontroller',['registerServices'])

.controller('regCtrl',function (User,$http) {
	
	var app = this;

	this.reguser = function(regdata){
		app.loading = true;
		app.error = false;
		app.success = false;
		if (this.regdata == null) {
			app.error = true;
			this.message = "please provide all the fields";
			app.loading = false;
		}
		else if (this.regdata.username.length < 7 || this.regdata.password.length < 7 || this.regdata.Conpassword == null ) {
			app.error = true;
			this.message = "Username and Password must be 6 character long";
			app.loading = false;
		}else{
			if (this.regdata.Conpassword == this.regdata.password) {
				User.create(this.regdata).then(function(data){
					app.loading = false;
					app.success = true;
					app.message = data.data.message;
				});
				}else{
					app.error = true;
					this.message = "Confirm password are not match";
					app.loading = false;		
				}
			}
	}
});