var User = require('./models/users');
var jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');

module.exports = function (router) {
	router.post('/users',function(req,res){
		var user = new User();
		user.username = req.body.username;
		user.email  = req.body.email;
		user.password = req.body.password;
		user.emailtoken = jwt.sign({ username: user.username, email: user.email}, 'yash', { expiresIn: '10m' });
		user.name = req.body.name;
		if (req.body.username == null || req.body.username == '' || req.body.name == null || req.body.name == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '') {
			res.json({ success: false , message: 'please provide username, email and password'})
		}
		else{
			user.save(function(err){
				if (err) {
					res.json({ success: false, message: err });
				}else{
					sgMail.setApiKey('');
					msg = {
					  to: user.email,
					  from: 'Confirm@Interestedme.com',
					  subject: 'Confirm your Account',
					  text: 'you are register on localhost.com but you are not confirm your email address for confirm it pleas click on the below link',
					  html: '<strong>you are register on localhost.com but you are not confirm your email address for confirm it pleas click on the below link.</strong>localhost:5500/confirm/'+user.emailtoken+'<br><a href="localhost:5500/confirm/'+ user.emailtoken +'"> Click here </a>',
					};
					if(sgMail.send(msg))
					{
						res.json({ success: true, message: 'User is created but Account is not activated'});	
					}else{
						res.json({ success: false, message: 'email is not send'});
					}
				}
			});
		}
	});

	router.put('/confirm/:token',function (req,res) {
		User.findOne({emailtoken : req.params.token},function (err,user) {
			if (err) throw err;
			var token = req.params.token;
			console.log(token);
			jwt.verify(token,'yash',function (err, decoded) {
				if (err) {
					res.json({ success: false, message: 'Account is expired' });
				}else{
					user.emailtoken = false;
					user.active = true;
					user.save(function (err) {
						if (err) {
							console.log(err);
						}else{
							res.json({ success: false, message: 'Account is activated' });
						}
					})
				}
			})
		});
	});

	router.post('/auth',function(req,res){
		User.findOne({ username: req.body.username }).select(' email username password').exec(function(err,user){
			if (err) throw err;
			if (!user) {
				res.json({ success:false , message: 'user not found' });
			}else{
				if (req.body.password) {
					var correct = user.compare(req.body.password);
					if (correct) {
						var token =	jwt.sign({ username: user.username, email: user.email}, 'yash', { expiresIn: '24h' });
						res.json({ success:true , message: 'All data is okk' , token: token});
					}else{
						res.json({ success:false , message: 'Password is wrong' });
					}
				}
			}
		});
	});

	router.get('/forgotusername/:email',function (req,res) {
		User.findOne({ email: req.params.email}).select(' username  email ').exec(function (err,user) {
			if (err) throw err;
			if (!user) {
				res.json({ success:false , message: 'email not found' });
			}else{
				sgMail.setApiKey('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');
				msg = {
				  to: user.email,
				  from: 'Confirm@Interestedme.com',
				  subject: 'Your username at localhost.com',
				  text: 'This mail is for forgotting username',
				  html: 'Your usename is ' + user.username,
				};
				if(sgMail.send(msg))
				{
					res.json({ success: true, message: 'please check your mail for username'});	
				}else{
					res.json({ success: false, message: 'email is not send'});
				}
			}
		});
	});

	router.post('/reset',function (req,res) {
		User.findOne({ username: req.body.username}).select(' password ').exec(function (err, user) {
			if (err) throw err;
			if (!user) {
				res.json({ success:false , message: 'username is not found' });
			}else{
				user.password = req.body.password;
				user.save(function (err) {
					if (err) {
						res.json({ success: false , error: err});
					}else{
						res.json({ success: true , message: 'password successfully changed'});
					}
				}
				);
			}
		});
	});

	router.get('/forgotpassword/:username',function (req,res) {
		User.findOne({ username: req.params.username}).select(' username  email ').exec(function (err,user) {
			if (err) throw err;
			if (!user) {
				res.json({ success:false , message: 'username is not found' });
			}else{
				var token =	jwt.sign({ username: user.username, email: user.email}, 'yash', { expiresIn: '24h' });
				sgMail.setApiKey('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');
				msg = {
				  to: user.email,
				  from: 'Confirm@Interestedme.com',
				  subject: 'Reset your password at localhost.com',
				  text: 'This mail is for forgotting password of' + user.username,
				  html: 'for changging password please click here <a href="localhost:5500/reset/'+ token +'">localhost:5500/reser/'+ token +'</a>',
				};
				if(sgMail.send(msg))
				{
					user.emailtoken = token;
					user.save(function (err) {
						if (err) {
							console.log(err);
						}else{
							res.json({ success: true, message: 'please check your mail for reset password'});
						}
					});	
				}else{
					res.json({ success: false, message: 'email is not send'});
				}
			}
		});
	});

	router.get('/check-user/:token',function (req,res) {
		User.findOne({ emailtoken: req.params.token }).select(' username ').exec(function (err, user) {
			if (err) throw err;
			var token = req.params.token;
			jwt.verify(token,'yash',function (err, decoded) {
				if (err) {
					res.json({ success: false, message: 'link is expired' });
				}else{
							res.json({ success: true, message: decoded });
						
					}
				})
			})
		});

	router.use(function(req,res,next){
		var token = req.body.token || req.body.query || req.headers['x-access-token'];
		if (token) {
			jwt.verify(token,'yash',function(err,decoded){
				if (err) {
					res.json({ success: false, message: 'Invalid token provided'});		
				}else{
					req.decoded = decoded;
				}
			});
		}else{
			res.json({ success: false, message: 'no token provided'});
		}
		next();
	});

	router.post('/me',function(req,res){
		res.send(req.decoded);
	});

	return router;
}
