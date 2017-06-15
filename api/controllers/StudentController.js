/**
 * StudentController
 *
 * @description :: Server-side logic for managing students
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const fetch = require('node-fetch');
const jwt = require('jwt-simple');
const fs = require("fs");
let  mailvalidation = require('send-validation-email');
module.exports = {
	
	login: function (req, res) {
		try {
			var account = req.body.account;
			var password = req.body.password;
			var secret = 'zzggzz';
			var result = Student.findOne({
				account: account,
				password: password,
			}).exec(function(err, data){
				if (err) {
				    return res.serverError(err);
				}
				if(!data){
					return res.notFound('Could not find Finn, sorry.');
				}
				if(data.validation==false){
					return res.ok({
						text:"validate error"	
					});
				}
				console.log("heoolo");
				console.log(data);
				var moment = require("moment");
			    var expires = moment().add(7, 'days').valueOf();
			    console.log("id = " + data.id);
			    var token = jwt.encode({
			      iss: data.id,
			      exp: expires,
			      name: data.name
			    }, secret);
			    Student.update({
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
			Student.findOne({id:decoded.iss}).exec((err,data)=>{
					if(err){
							console.log("error = " + err);
							return res.ok({
								text: "Student not found"
							})
						}
						if(!data){
							return res.ok({
								text: "Student not data",
							})
						}
						else{
							Student.update({id:decoded.iss},{validation:true}).exec((err,data)=>{
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
	register: function (req, res){
		try {
			const name = req.body.name;
			const gender = req.body.gender;
			const email = req.body.email;
			const account = req.body.account;
			const password = req.body.password;
			
			const secret = 'zzggzz';
			let newStudent = Student.create({
				name: name,
                gender: gender,
                email: email,
                account: account,
                password: password,
                validation: false,
                avatar: null,
			})
			.then(function(){
				
				var result = Student.findOne({
					account: account,
					password: password,
				}).exec(function(err, data){
					if(err){
						console.log(err);
						return res.ok({
							text: 'Student not found'
						})
					}
					if(!data){
						return res.ok({
							text: 'Student not found'
						})
					}
					console.log("heoolo");
					console.log(data);
					console.log("Studentname = " + data.name);
					var moment = require("moment");
				    var expires = moment().add(7, 'days').valueOf();
				    console.log("id = " + data.id);
				    const token = jwt.encode({
				      iss: data.id,
				      exp: expires,
				      name: data.name,
				      identity: 'student',
				    }, secret);
				    mailvalidation.setting({
				    	user:"pxtv108@gmail.com",
				    	pass:"o4yyb28c"
				    });
				    mailvalidation.sendValidationEmail({
				    	 revName: name,
						 revAddress: email,
						 validationURL: `https://test-zzpengg.c9users.io:8080/student/emailvalidation?token=${token}`
				    });
				    Student.update({
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
				console.log("decoded = " + decoded.iss);
				if (decoded.exp <= Date.now()) {
					console.log("Access token has expired");
					return res.ok({
						text: "Access token has expired"
					});
				}
				else{
					Student.findOne({ id: decoded.iss }).exec(function(err,data){
						if(err){
							console.log("error = " + err);
							return res.ok({
								text: "Student not found"
							})
						}
						if(!data){
							return res.ok({
								text: "student not data",
							})
						}
						if(data.validation==false){
							return res.ok({
								text:"validate error"	
							});
						}
						else{
							return res.ok({
								text: "check success",
								name: data.name
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
					Student.findOne({ id: decoded.iss }).exec(function(err,data){
						if(err){
							console.log("error = " + err);
							return res.ok({
								text: "Student not found"
							})
						}
						if(!data){
							return res.ok({
								text: "student not data",
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
		console.log("**********updateMyInfo************");
		var token = req.headers['x-access-token'];
		let name = req.body.name;
		let password = req.body.password;
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
					Student.findOne({ id: decoded.iss }).exec(function(err,data){
						if(err){
							console.log("error = " + err);
							return res.ok({
								text: "Student not found"
							})
						}
						if(!data){
							return res.ok({
								text: "student not data",
							})
						}
						else{
							console.log("update")
							Student.update({
								id: decoded.iss
							},{
								name: name,
								password: password,
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
	
	upload: function  (req, res) {
		console.log("*****uploadavatarStudent******");
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
		const studentId = decoded.iss;
		req.file('avatar').upload({
		  dirname: require('path').resolve(sails.config.appPath, `assets/images/avatar/student/${studentId}`)
		},function (err, uploadedFiles) {
		  if (err) return res.negotiate(err);
		  let str = uploadedFiles[0].fd.split('/');
		  Student.findOne({id:studentId}).exec(function(err,data){
		  	//console.log(data);
		  	let filename=str[10];
		  	console.log(str[10]);
		  	if(!data.avatar){ // 沒有圖片
		  		Student.update({id:studentId},{avatar:filename}).exec(
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
		  		fs.unlink(`./assets/images/avatar/student/${studentId}/${data.avatar}`,function(err){
					if(err)  console.log(err);
					console.log('file deleted successfully');
				});
				Student.update({id:studentId},{avatar:filename}).exec(
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
	FBLogin: async function (req, res){
		try {
			const name = req.body.name;
			const gender = req.body.gender;
			const email = req.body.email;
			const account = req.body.account;
			const password = req.body.password;
			const avatar = req.body.avatar;
			const userId = req.body.userId;
			const secret = 'zzggzz';
			const url = `https://graph.facebook.com/v2.8/${userId}/picture?access_token=${password}&type=large`
			const response = await fetch(url).then();
			console.log(response);
			Student.findOne({
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
					Student.update({
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
	FBRegister:async function (req, res){
		try {
			const name = req.body.name;
			const gender = req.body.gender;
			const email = req.body.email;
			const account = req.body.account;
			const password = req.body.password;
			const avatar = req.body.avatar;
			const userId = req.body.userId;
			const secret = 'zzggzz';
			const url = `https://graph.facebook.com/v2.8/${userId}/picture?access_token=${password}&type=large`
			const response = await fetch(url).then();
			console.log(response);
			Student.findOne({
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
					Student.update({
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
			    	var newUser = Student.create({
						name: name,
		                gender: gender,
		                email: email,
		                account: account,
		                password: password,
		                avatar: response.url,
					})
					.then(function(){
						
						var result = Student.findOne({
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
						    Student.update({
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
};