/**
 * HouseController
 *
 * @description :: Server-side logic for managing houses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 
const jwt = require('jwt-simple');

module.exports = {
	
	index: function(req, res){
	    var result = House.find({})
	        .then(function(data){
	            res.ok({
	                text: "find success",
	                data: data,
	            })
	        })
	},
	
	findMyHouse: function(req, res){
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
	
	createMyHouse: function(req, res){
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
					console.log(req.body.title);
					console.log(req.body.area);
					console.log(req.body.checkwater);
					console.log(req.body.checkele);
					console.log(req.body.checknet);
					console.log("id = " + decoded.id);
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
};
