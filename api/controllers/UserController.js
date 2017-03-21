/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 
const jwt = require('jwt-simple');

module.exports = {
	checkIdRepeat: function(req,res) {
		try{
			var name = req.headers['name'];
			var result =  User.findOne({
				name:name
			}).exec(function(err, data){
				if(err){
					console.log(err);
					res.ok({
						text: 'user not found'
					})
				}
				else{
				 res.ok({
				 	data:1
				 })
				}
		 })
		} catch (err){
			console.log("catch error = " + err);
		}	
	},
	login: (req, res) => {
		try {
			var account = req.body.account;
			console.log(account);
			var password = req.body.password;
			console.log(password);
			var secret = 'zzggzz';
			var result = User.findOne({
				account: account,
				password: password,
			}).exec(function(err, data){
				if(err){
					console.log(err);
					return res.ok({
						text: 'user not found'
					})
				}
				if(!data){
					return res.ok({
						text: 'user not found'
					})
				}
				console.log("heoolo");
				console.log(data);
				console.log("username = " + data.name);
				var moment = require("moment");
			    var expires = moment().add(7, 'days').valueOf();
			    console.log("id = " + data.id);
			    var token = jwt.encode({
			      iss: data.id,
			      exp: expires,
			      name: data.name
			    }, secret);
			    User.update({
			    	account: account,
			    	password: password
			    },{
			    	token: token
			    }).exec(function(err, updated){
			    	if(err){
			    		console.log("updated error");
			    	}
			    	console.log("token = " + token);
					console.log("data = " + updated);
					res.ok({
						text: 'login success',
						token: token,
					});
			    })
			    
			})
		} catch (err){
			console.log("catch error = " + err);
			res.serverError(err);
		}
	},
	
	register: function (req, res){
		try {
			var name = req.body.name;
			var phone = req.body.phone;
			var gender = req.body.gender;
			var address = req.body.address;
			var account = req.body.account;
			var password = req.body.password;
			var secret = 'zzggzz';
			var newUser = User.create({
				name: name,
                phone: phone,
                gender: gender,
                address: address,
                account: account,
                password: password,
			})
			.then(function(){
				
				var result = User.findOne({
					account: account,
					password: password,
				}).exec(function(err, data){
					if(err){
						console.log(err);
						return res.ok({
							text: 'user not found'
						})
					}
					if(!data){
						return res.ok({
							text: 'user not found'
						})
					}
					console.log("heoolo");
					console.log(data);
					console.log("username = " + data.name);
					var moment = require("moment");
				    var expires = moment().add(7, 'days').valueOf();
				    console.log("id = " + data.id);
				    var token = jwt.encode({
				      iss: data.id,
				      exp: expires,
				      name: data.name
				    }, secret);
				    User.update({
				    	account: account,
				    	password: password
				    },{
				    	token: token
				    }).exec(function(err, updated){
				    	if(err){
				    		console.log("updated error");
				    	}
				    	console.log("token = " + token);
						console.log("data = " + updated);
						res.ok({
							text: 'register success',
							token: token,
						});
				    })
				    
				})
				
			})
		} catch (e) {
			res.serverError(e);
		}
	},
	
	checkAuth: function(req, res) {
		var token = req.headers['x-access-token'];
		console.log("token = " + token);
		var secret = 'zzggzz';
		if(token){
			try {
				var decoded = jwt.decode(token, secret);
				if (decoded.exp <= Date.now()) {
					console.log("Access token has expired");
					res.ok({
						text: "Access token has expired"
					});
				}
				else{
					User.findOne({ id: decoded.iss }).exec(function(err,data){
						if(err){
							res.serverError(e);
						}
						if(!data){
							res.ok({
								text: 'not found'
							});
						}
						else{
							console.log("data = " + data);
							console.log("name = " + data.name);
							res.ok({
								text: "check success",
								name: data.name
							})
						}
					})
				}
				
			}catch (error){
				console("catch error = " + error);
				res.ok({
					text: "something went wrong"
				})
			}
		}

	},
};

