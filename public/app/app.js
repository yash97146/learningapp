angular.module('AppUse',['appRoute','registercontroller','registerServices','logincontroller','resetpassword','authServices','emailcontroller','forgotcontroller','forgotpassword'])

.config(function ($httpProvider) {
	$httpProvider.interceptors.push('AuthInterceptors');
});