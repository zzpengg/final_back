/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 
const jwt = require('jwt-simple');
const nodemailer = require('nodemailer');
module.exports = {
	checkIdRepeat: async (req,res) => {
		try{
			let account = await req.body.account;
			console.log("gg");
			console.log(account);
			let result =await User.findOne({
				account: account
			}).exec( (err, data) => {
				if(err){
					console.log(err+"fuck you");
					res.ok({
						text: 'user not found'
					})
				}
				if(!data){
					res.ok({
						text: 'not found'
					});
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
	login: async(req, res) => {
		try {
			var account =await  req.body.account;
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
			var avatar = req.body.avatar;
			var secret = 'zzggzz';
			var newUser = User.create({
				name: name,
                phone: phone,
                gender: gender,
                address: address,
                account: account,
                password: password,
                avatar: avatar,
			})
			.then(function(){
				
				var result = User.findOne({
					account: account,
					password: password,
				}).exec(function(err, data){
					const fs = require('fs');
					let dir = `assets/images/house/${account}`;

					if (!fs.existsSync(dir)){
    				fs.mkdirSync(dir);
					}
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
				      name: data.name,
				      identity: 'landlord'
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
								name: data.name,
								avatar: data.avatar,
								account:data.account
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
	
	upload: function  (req, res) {
		console.log("upload");
		req.file('avatar').upload({
		  dirname: require('path').resolve(sails.config.appPath, 'assets/images/avatar/')
		},function (err, uploadedFiles) {
		  if (err) return res.negotiate(err);
		  
		  console.log(uploadedFiles);
		  let str = uploadedFiles[0].fd.split('/');
		  console.log(str);
		  return res.json({
		    message: uploadedFiles.length + ' file(s) uploaded successfully!',
		    file: str[7]
		  });
		});
	},

	  
	test: function  (req, res) {
		console.log("upload");
		console.log(req.body.avatar);
		res.ok({
			text: 'upload success',
			file: req.body.avatar,
		})
	},
	
	getMyInfo: function(req, res) {
		var token = req.headers['x-access-token'];
		console.log("token = " + token);
		var secret = 'zzggzz';
		if(token){
			try {
				var decoded = jwt.decode(token, secret);
				console.log("decoded = " + decoded.iss);
				if (decoded.exp <= Date.now()) {
					console.log("Access token has expired");
					return res.ok({
						text: "Access token has expired"
					});
				}
				else{
					User.findOne({ id: decoded.iss }).exec(function(err,data){
						if(err){
							console.log("error = " + err);
							return res.ok({
								text: "User not found"
							})
						}
						if(!data){
							return res.ok({
								text: "User not data",
							})
						}
						else{
							return res.ok({
								text: "getMyInfo success",
								data: data
							})
						}
					})
				}
				
			}catch (error){
				console("catch error = " + error);
				return res.ok({
					text: "something went wrong"
				})
			}
		}
	},
	
	updateMyInfo: function(req, res) {
		console.log("**********updateMyInfoLandlord************");
		var token = req.headers['x-access-token'];
		let name = req.body.name;
		let password = req.body.password;
		let phone = req.body.phone;
		console.log("token = " + token);
		console.log('name = ' + name);
		console.log("password = " + password);
		var secret = 'zzggzz';
		if(token){
			try {
				var decoded = jwt.decode(token, secret);
				console.log("decoded = " + decoded.iss);
				if (decoded.exp <= Date.now()) {
					console.log("Access token has expired");
					return res.ok({
						text: "Access token has expired"
					});
				}
				else{
					User.findOne({ id: decoded.iss }).exec(function(err,data){
						if(err){
							console.log("error = " + err);
							return res.ok({
								text: "User not found"
							})
						}
						if(!data){
							return res.ok({
								text: "User not data",
							})
						}
						else{
							console.log("update")
							User.update({
								id: decoded.iss
							},{
								name: name,
								password: password,
								phone: phone,
							}).exec(function(err, data){
								console.log("update success");
								return res.ok({
									text: "updateMyInfo success",
								})
							})
						}
					})
				}
				
			}catch (error){
				console("catch error = " + error);
				return res.ok({
					text: "something went wrong"
				})
			}
		}
	},
	
	FBLogin: function (req, res){
		try {
			var name = req.body.name;
			var phone = req.body.phone;
			var gender = req.body.gender;
			var address = req.body.address;
			var email = req.body.email;
			var account = req.body.account;
			var password = req.body.password;
			var avatar = req.body.avatar;
			var secret = 'zzggzz';
			User.findOne({
				name,
				account,
			}).exec(function(err, data) {
			    if(data){
			    	console.log('FB ID exist');
			    	var moment = require("moment");
				    var expires = moment().add(7, 'days').valueOf();
				    console.log("id = " + data.id);
				    var token = jwt.encode({
				      iss: data.id,
				      exp: expires,
				      name: data.name,
				      identity: 'landlord'
				    }, secret);
					User.update({
						account
					},{
						password,
						token
					}).exec(function(err, data) {
						
					    res.ok({
							text: 'update token(password) successful',
							token: token
						})
					})
			    }else{
			    	var newUser = User.create({
						name: name,
		                phone: phone,
		                gender: gender,
		                address: address,
		                email: email,
		                account: account,
		                password: password,
		                avatar: avatar,
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
							console.log(data);
							console.log("username = " + data.name);
							var moment = require("moment");
						    var expires = moment().add(7, 'days').valueOf();
						    console.log("id = " + data.id);
						    var token = jwt.encode({
						      iss: data.id,
						      exp: expires,
						      name: data.name,
						      identity: 'landlord'
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
			    }
			})
		} catch (e) {
			res.serverError(e);
		}
	},
	
	addMyLove: async(req, res) => {
		
	}
	
	
	  
};

