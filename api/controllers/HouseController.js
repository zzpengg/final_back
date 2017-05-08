/**
 * HouseController
 *
 * @description :: Server-side logic for managing houses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 
const jwt = require('jwt-simple');
const fs = require("fs");
module.exports = {
	
	index: function(req, res){
		res.set('Access-Control-Allow-Origin', '*');
	    var result = House.find({})
	        .then(function(data){
	            res.ok({
	                text: "find success",
	                data: data,
	            })
	        })
	},
	
	findMyHouse: function(req, res){
		console.log('********findMyHouse*****');
		var token = req.headers['x-access-token'];
		var secret = 'zzggzz';
		console.log("Token = " + token);
		if(token){
			try{
				var decoded = jwt.decode(token, secret);
				if (decoded.exp <= Date.now()) {
					res.ok({
						text: "Access token has expired"
					});
				}
				House.find({ landlordId: decoded.iss }).exec(function(err,findData){
					if(err){
						console.log("error = " + err);
						res.ok({
							text: "user not found"
						})
					}
					console.log("id = " + decoded.iss);
					console.log("data = " + findData);
					res.ok({
						text: "house check success",
						data: findData,
					})
				})
			}catch(error){
				console.log("catch error = " + error);
				res.ok({
					text: "something went wrong" + error
				})
			}
		}
	},
	
	findTheUserHouse: async(req, res) => {
		console.log('**********findTheUserHouse**********');
		try{
			let id = req.body.houseId;
			var token = req.headers['x-access-token'];
			var secret = 'zzggzz';
			console.log("Token = " + token);
			if(token){
				var decoded = jwt.decode(token, secret);
				if (decoded.exp <= Date.now()) {
					res.ok({
						text: "Access token has expired"
					});
				}
				House.findOne({ landlordId: decoded.iss, id }).exec(function(err,findData){
					if(err){
						console.log("error = " + err);
						res.ok({
							text: "user not found"
						})
					}
					console.log("id = " + decoded.iss);
					console.log("data = " + findData);
					res.ok({
						text: "house check success",
						data: findData,
					})
				})
			}
			let findHouse = await House.findOne({
				id
			});
			if(!findHouse){
				console.log('house not found');
				return res.ok({
					text: 'house not found'
				});
			}
			else{
				console.log(findHouse);
				return res.ok({
					text: 'house find success',
					data: findHouse,
				})
			}
		}catch(error){
			console.log("catch error = " + error);
			res.ok({
				text: "something went wrong" + error
			})
		}
	},
	
	createMyHouse: async(req, res) => {
		var token = req.headers['x-access-token'];
		console.log(token);
		var secret = 'zzggzz';
		console.log(req.body.title);
		console.log(req.body.area);
		if(token){
			try{
				var decoded = jwt.decode(token, secret);
				if (decoded.exp <= Date.now()) {
					res.ok({
						text: "Access token has expired"
					});
				}
				else{
					let id = decoded.iss;
					let landlord = await User.findOne({
						id,
					});
					console.log(landlord);
					let phone = landlord.phone;
					console.log(req.body.title);
					console.log(req.body.area);
					console.log(req.body.checkwater);
					console.log(req.body.checkele);
					console.log(req.body.checknet);
					console.log("id = " + decoded.iss);
					House.create({
						title: req.body.title,
						area: req.body.area,
						address: req.body.address,
						vacancy: req.body.vacancy,
						rent: req.body.rent,
						checkwater: req.body.checkwater,
						checkele:req.body.checkele,
						checknet:req.body.checknet,
						type: req.body.type,
						landlordId: decoded.iss,
						phone: phone,
						path:[],
						score: 0,
					}).exec(function(err,data){
						if(err){
							console.log("error = " + err);
							res.ok({
								text: "house create not success"
							})
						}
						else{
							console.log("data = " + data);
							res.ok({
								text: "house create success",
							})
						}
					})
				}
			}catch(error){
				console.log("catch error = " + error);
				res.ok({
					text: "something went wrong" + error
				})
			}
		}
	},
	
	updateMyHouse: function(req, res){
		var token = req.headers['x-access-token'];
		var secret = 'zzggzz';
		console.log(req.body.title);
		console.log(req.body.area);
		console.log(req.body.id);
		if(token){
			try{
				var decoded = jwt.decode(token, secret);
				if (decoded.exp <= Date.now()) {
					res.ok({
						text: "Access token has expired"
					});
				}
				console.log(req.body.title);
				console.log(req.body.area);
				console.log(req.body.id);
				House.update({
					id: req.body.id
				},{
					title: req.body.title,
					area: req.body.area,
					address: req.body.address,
					vacancy: req.body.vacancy,
					rent: req.body.rent,
					checkwater: req.body.checkwater,
					checkele:req.body.checkele,
					checknet:req.body.checknet,
					type: req.body.type,
				}).exec(function(err,data){
					if(err){
						console.log("error = " + err);
						res.ok({
							text: "house update not success"
						})
					}
					console.log("data = " + data);
					res.ok({
						text: "house update success",
					})
				})
			}catch(error){
				console.log("catch error = " + error);
				res.ok({
					text: "something went wrong" + error
				})
			}
		}
	},
	findFilterHouse: function(req, res){
		var filter = [];
		var area = req.body.area;
        var type = req.body.type;
        var rent = req.body.rent;
        var waterandelec = req.body.waterandelec;
        console.log("area = " + area);
        console.log("type = " + type);
        console.log("rent = " + rent);
        console.log("waterandelec = " + waterandelec);
        filter.push({
        	area: area,
        })
        if(rent==0){
        	rent = 3000
        }
        House.find({
        	area: area,
        	type: type
        }).exec(function(err, data) {
        	if(err){
				console.log("error = " + err);
				res.ok({
					text: "house find not success"
				})
			}
			console.log("data = " + data);
			res.ok({
				text: "house find success",
				data: data,
			})
        })
	},
	
	findTheHouse: async(req, res) => {
		try{
			let id = req.body.houseId;
			let findHouse = await House.findOne({
				id
			});
			if(!findHouse){
				console.log('house not found');
				return res.ok({
					text: 'house not found'
				});
			}
			else{
				console.log(findHouse);
				return res.ok({
					text: 'house find success',
					data: findHouse,
				})
			}
		}catch(error){
			console.log("catch error = " + error);
			res.ok({
				text: "something went wrong" + error
			})
		}
	},
	
	findHouseData: async(req, res) => {
		console.log('******findHouseData******');
		try{
			let findHouse = await House.find({});
			if(!findHouse){
				console.log('house is null');
				return res.ok({
					text: 'house is null'
				});
			}
			else{
				console.log(findHouse);
				let newHouse = [];
				findHouse.map(({ id, title, area, rent, score }, index) => {
					newHouse.push({
						id,
						title,
						area, 
						rent, 
						score
					})
				})
				console.log(newHouse);
				res.set('Access-Control-Allow-Origin', '*');
				return res.ok({
					text: 'house find success',
					data: newHouse,
				})
			}
		}catch(error){
			console.log("catch error = " + error);
			res.ok({
				text: "something went wrong" + error
			})
		}
	},
	
	deleteMyHouse: function(req, res){
		console.log("**********deleteMyHouse************");
		var token = req.headers['x-access-token'];
		let id = req.body.id;
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
							console.log("delete");
							console.log(data.id);
							const path = `./assets/images/house/${decoded.iss}/${id}`;
							  if( fs.existsSync(path) ) {
								    fs.readdirSync(path).forEach(function(file,index){
								      const curPath = path + "/" + file;
								      if(fs.lstatSync(curPath).isDirectory()) { // recurse
								        deleteFolderRecursive(curPath);
								      } else { // delete file
								        fs.unlinkSync(curPath);
								      }
								    });
								    fs.rmdirSync(path);
								    console.log("folder already delete");
								  }

							House.destroy({id: id}).exec(function (err){
								if (err) {
								    return res.ok({
								    	text: err
								    });
								}
								console.log('delete success');
								return res.ok({
									text: 'delete success'
								});
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
		uploadhousephoto: function  (req, res) {
		console.log("*****uploadhouse******");
		console.log(req.body.id);
		var token = req.headers['x-access-token'];
		console.log("token = " + token);
		var secret = 'zzggzz';
		if(token){
			var decoded = jwt.decode(token, secret);
			if (decoded.exp <= Date.now()) {
				console.log("Access token has expired");
				return res.ok({
					text: "Access token has expired"
				});
			}
		var landlordId = decoded.iss;
		req.file('house').upload({
		  dirname: require('path').resolve(sails.config.appPath, `assets/images/house/${landlordId}/${req.body.id}`)
		},function (err, uploadedFiles) {
		  if (err)  res.negotiate(err);
		  let str = uploadedFiles[0].fd.split('/');
		  House.findOne({id:req.body.id}).exec(function(err,data){
		  	//console.log(data);
		  	let filename=str[10];
		  	console.log(str[10]);
		  	if(!data.path){
		  		House.update({id:req.body.id},{path:[filename]}).exec(
		  			function(err,data){
		  				if(err)  return res.serverError(e);
		  				else{
		  					 return res.ok({
		  						text:"success upload"
		  					});
		  				}
		  			});
		  	}
		  	else{
		  			House.update({id:req.body.id},{
		  			path:[...data.path,filename]}).exec(
		  				function(err,data){
		  					if(err)  return res.serverError(e);
		  					else{
		  						 return res.ok({
		  						text:"success upload"
		  					});
		  				}
		  			})
		  	}
		  })
		  console.log(uploadedFiles);
		  console.log(str);

		});
		}
		
	},
	deletehousephoto:function(req,res){
		try{
			var token = req.headers['x-access-token'];
			console.log("token = " + token);
			console.log (req.body);
			var houseid = req.body.id;
			var path = req.body.path;
			var secret = 'zzggzz';
			if(token){
				var decoded = jwt.decode(token, secret);
				if (decoded.exp <= Date.now()) {
					console.log("Access token has expired");
					return res.ok({
						text: "Access token has expired"
					});
				}
			var landlordId = decoded.iss;
			House.findOne({id:houseid}).exec(function(err,data){
						if(err){
							console.log("error = " + err);
							return res.ok({
								text: "House not found"
							})
						}
						if(!data){
							return res.ok({
								text: "House not data",
							})
						}
						else{
							for (var i = 0 ; i < data.path.length;i++){
								if(data.path[i]==path){
									data.path.splice(i,1);
									House.update({id:houseid},{path:[...data.path]}).exec(function (err){
										  if (err) {
										    return res.negotiate(err);
										  }
										  console.log('delete path success');
										  return res.ok();
										});
									  fs.unlink(`./assets/images/house/${landlordId}/${houseid}/${path}`,function(err){
        								if(err) return console.log(err);
        								console.log('file deleted successfully');
									});  	
								}
							}
						}
						})
			}
		}
		catch(error){
				console.log("catch error = " + error);
				return res.ok({
					text: "something went wrong"
				})
		}
	}
};

