/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 
const jwt = require('jwt-simple');
const fs = require("fs");
const fetch = require('node-fetch');
let  mailvalidation = require('send-validation-email');
module.exports = {
	checkIdRepeat: async (req,res) => {
		try{
			let account = await req.body.account;
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
			const account =await  req.body.account;
			console.log(account);
			const password = req.body.password;
			console.log(password);
			const secret = 'zzggzz';
			const result = User.findOne({
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
				if(data.validation==false){
					return res.ok({
						text:"validate error"	
					});
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
	emailvalidation:async(req,res)=>{
		try{
			const token = req.param('token');
			const secret = "zzggzz";
			let decoded = jwt.decode(token, secret);
			User.findOne({id:decoded.iss}).exec((err,data)=>{
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
							User.update({id:decoded.iss},{validation:true}).exec((err,data)=>{
								console.log("validate success");
								console.log(data[0].name);
								return res.view('success', {revName:data[0].name});
							});
						}	
			});
		}
		catch(err){
			res.serverError(e);
		}
	},
	register: async (req, res)=>{
		try {
			var name = req.body.name;
			var phone = req.body.phone;
			var gender = req.body.gender;
			var address = req.body.address;
			var account = req.body.account;
			var password = req.body.password;
			var email = req.body.email;
			var secret = 'zzggzz';
			var newUser = User.create({
				name: name,
                phone: phone,
                email: email,
                gender: gender,
                address: address,
                account: account,
                password: password,
                validation:false,
                avatar: null,
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
				    mailvalidation.setting({
				    	user:"pxtv108@gmail.com",
				    	pass:"o4yyb28c"
				    });
				    mailvalidation.sendValidationEmail({
				    	 revName: name,
						 revAddress: email,
						 validationURL: `https://test-zzpengg.c9users.io:8080/user/emailvalidation?token=${token}`
				    });
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
							return	res.serverError(e);
						}
						if(!data){
							return res.ok({
								text: 'not found'
							});
						}
						if(data.validation==false){
							return res.ok({
								text:"validate error"	
							});
						}
						else{
							console.log("data = " + data);
							console.log("name = " + data.name);
							res.ok({
								text: "check success",
								name: data.name,
								avatar: data.avatar,
								account:data.account,
								id:data.id
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
		console.log("*****uploadavatar******");
		const token = req.headers['x-access-token'];
		console.log("token = " + token);
		const secret = 'zzggzz';
		if(token){
			const decoded = jwt.decode(token, secret);
			if (decoded.exp <= Date.now()) {
				console.log("Access token has expired");
				// return res.ok({
				// 	text: "Access token has expired"
				// });
			}
		const landlordId = decoded.iss;
		req.file('avatar').upload({
		  dirname: require('path').resolve(sails.config.appPath, `assets/images/avatar/user/${landlordId}`)
		},function (err, uploadedFiles) {
		  if (err) return res.negotiate(err);
		  let str = uploadedFiles[0].fd.split('/');
		  User.findOne({id:landlordId}).exec(function(err,data){
		  	//console.log(data);
		  	let filename=str[10];
		  	console.log(str[10]);
		  	if(!data.avatar){ // 沒有圖片
		  		User.update({id:landlordId},{avatar:filename}).exec(
		  			function(err,data){
		  				if(err)  return res.serverError(e);
		  				else{
		  					 return res.ok({
		  						text:"success upload"
		  					});
		  				}
		  			});
		  	}
		  	else{ // 有圖片
		  		fs.unlink(`./assets/images/avatar/user/${landlordId}/${data.avatar}`,function(err){
					if(err)  console.log(err);
					console.log('file deleted successfully');
				});
				User.update({id:landlordId},{avatar:filename}).exec(
		  			function(err,data){
		  				if(err)  return res.serverError(e);
		  				else{
		  					 return res.ok({
		  						text:"success upload"
		  					});
		  				}
		  			});
		  	}
		  })
		  console.log(uploadedFiles);
		  console.log(str);

		});
		}
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
					});
				}
				
			}catch (error){
				console("catch error = " + error);
				return res.ok({
					text: "something went wrong"
				})
			}
		}
	},
	
	updateMyPhone: function(req, res) {
		console.log("**********updateMyPhoneLandlord************");
		var token = req.headers['x-access-token'];
		let phone = req.body.phone;
		console.log("token = " + token);
		console.log('phone = ' + phone);
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
	
	updateMyName: function(req, res) {
		console.log("**********updateMyNameLandlord************");
		var token = req.headers['x-access-token'];
		let name = req.body.name;
		console.log("token = " + token);
		console.log('name = ' + name);
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
	FBRegister:async function (req, res){
		try {
			const name = req.body.name;
			const phone = req.body.phone;
			const gender = req.body.gender;
			const address = req.body.address;
			const email = req.body.email;
			const account = req.body.account;
			const password = req.body.password;
			const avatar = req.body.avatar;
			const userId = req.body.userId;
			const secret = 'zzggzz';
			const url = `https://graph.facebook.com/v2.8/${userId}/picture?access_token=${password}&type=large`
			const response = await fetch(url).then();
			console.log(response);
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
						token,
						avatar:response.url
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
		                avatar: response.url,
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
	FBLogin: async function (req, res){
		try {
			const name = req.body.name;
			const phone = req.body.phone;
			const gender = req.body.gender;
			const address = req.body.address;
			const email = req.body.email;
			const account = req.body.account;
			const password = req.body.password;
			const avatar = req.body.avatar;
			const userId = req.body.userId;
			const secret = 'zzggzz';
			const url = `https://graph.facebook.com/v2.8/${userId}/picture?access_token=${password}&type=large`
			const response = await fetch(url).then();
			console.log(response);
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
						token,
						avatar:response.url
					}).exec(function(err, data) {
						
					    res.ok({
							text: 'update token(password) successful',
							token: token
						})
					})
			    }
			})
		} catch (e) {
			res.serverError(e);
		}
	},
	
	allTrue: async(req, res) => {
		await User.update({},{validation: true});
		return res.ok({
			text: 'ok'
		})
	}
	  
};

