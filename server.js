var express = require('express');
var app = express();
var mongoose = require('mongoose');
var User = require('./back/models/users');
var bodyParser = require('body-parser');
var router = express.Router();
var appRouter = require('./back/api')(router);
var path = require('path');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use('/back-end', appRouter);

mongoose.connect('mongodb://localhost:27017/project',function(err){
	if (err) {
		console.log('not connect : ',err);
	}else{
		console.log('connected');
	}
});

app.get('*',function(req,res){
	res.sendFile(__dirname + '/public/pages/index.html');
});

app.listen(5500,function () {
	console.log('server is running');
});