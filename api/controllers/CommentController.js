/**
 * CommentController
 *
 * @description :: Server-side logic for managing comments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const jwt = require('jwt-simple');


module.exports = {
	
	createMyComment: async(req, res) => {
		console.log("*******createMyComment*********");
		let token = req.headers['x-access-token'];
		console.log("token = " + token);
		let secret = 'zzggzz';
		console.log(req.body.houseId);
		console.log(req.body.content);
		console.log(req.body.star);
		if(token){
			try{
				let decoded = jwt.decode(token, secret);
				if (decoded.exp <= Date.now()) {
					console.log("Access token has expired");
					res.ok({
						text: "Access token has expired"
					});
				}
				else{
					console.log("id = " + decoded.iss);
					let houseId = req.body.houseId;
					let userId = decoded.iss;
					let student = await Student.findOne({
						id: decoded.iss
					});
					console.log(student);
					let name = student.name;
					let content = req.body.content;
					let star = req.body.star;
					await Comment.create({
						houseId: houseId,
						userId: userId,
						name: name,
						content: content,
						like: 0,
						dislike: 0,
						star: star,
					})
					
					let dataStar = await Comment.find({
						houseId: houseId
					})
					
					let averageStar = 0;
					console.log('averageStar = ' + averageStar);
				    dataStar.map((val, index) => {
				    	console.log(val.star);
				    	if(val.star){
				    		averageStar += val.star
				    	}
				    })
					console.log('averageStar = ' + averageStar);
					console.log(dataStar.length);
					averageStar /= dataStar.length;
					averageStar = Math.round(averageStar * 10) / 10;
					await House.update({
						id: houseId
					}, {
						score: averageStar
					});
					
					res.ok({
						text: "comment create success",
					})
					
					// Comment.create({
					// 	houseId: houseId,
					// 	userId: userId,
					// 	name: name,
					// 	content: content,
					// 	like: 0,
					// 	dislike: 0,
					// 	star: star,
					// }).exec(function(err,data){
					// 	if(err){
					// 		console.log("error = " + err);
					// 		res.ok({
					// 			text: "house create not success"
					// 		})
					// 	}
					// 	else{
					// 		Comment.find({
					// 			houseId: houseId
					// 		}).exec(function(err, data) {
					// 		    let averageStar = 0;
					// 		    dataStar.map((val,index) => {
					// 				averageStar += val.star;
					// 			})
					// 			console.log('averageStar = ' + averageStar);
					// 			averageStar /= dataStar.length;
					// 			console.log('averageStar = ' + averageStar);
					// 			House.update({
					// 				id: houseId
					// 			}, {
					// 				score: averageStar
					// 			});
								
					// 			console.log("data = " + data);
					// 			res.ok({
					// 				text: "comment create success",
					// 			})
					// 		})
					// 	}
					// })
				}
			}catch(error){
				console.log("catch error = " + error);
				res.ok({
					text: "something went wrong" + error
				})
			}
		}
	},
	
	findHouseComment: async(req, res) => {
		console.log("*******findHouseComment*********");
		let houseId = req.body.houseId;
		console.log(req.body.houseId);
		try{
			let data = await Comment.find({
				houseId: houseId
			});
			if(!data){
				return res.notFound('comment not found');
			}else{
				console.log("data = " + data);
				for(let i=0;i<data.length;i++){
					if(!data[i].star){ // landlord
						let userName = await User.findOne({
							id: data[i].userId
						});
						if(data[i].name == userName){
							
						}else{
							data[i].name = userName.name;
						}
					}else{ // student
						let studentName = await Student.findOne({
							id: data[i].userId
						});
						if(data[i].name == studentName){
							
						}else{
							data[i].name = studentName.name;
						}
					}
				}
				
				return res.ok({
					text: "comment find success",
					data: data,
				})
			}
		}catch(error){
			console.log("catch error = " + error);
			res.ok({
				text: "something went wrong" + error
			})
		}
	},
	
	findBestComment: async(req, res) => {
		let houseId = req.body.houseId;
		console.log(req.body.houseId);
		try{
			let data = await Comment.find({
				where: { houseId: houseId },
			    limit: 3,
			    sort: 'like DESC'
			})
			
			if(!data){
				return res.notFound('comment not found');
			}
			else{
				console.log("data = " + data);
				for(let i=0;i<data.length;i++){
					if(!data[i].star){ // landlord
						let userName = await User.findOne({
							id: data[i].userId
						});
						if(data[i].name == userName){
							
						}else{
							data[i].name = userName.name;
						}
					}else{ // student
						let studentName = await Student.findOne({
							id: data[i].userId
						});
						if(data[i].name == studentName){
							
						}else{
							data[i].name = studentName.name;
						}
					}
				}
				
				return res.ok({
					text: "comment find best success",
					data: data,
				})
				
			}

			
		}catch(error){
			console.log("catch error = " + error);
			res.ok({
				text: "something went wrong" + error
			})
		}
	},
	
	createLandlordComment: async(req, res) => {
		console.log("*******createLandlordComment*********");
		let token = req.headers['x-access-token'];
		console.log("token = " + token);
		let secret = 'zzggzz';
		console.log(req.body.houseId);
		console.log(req.body.content);
		if(token){
			try{
				let decoded = jwt.decode(token, secret);
				if (decoded.exp <= Date.now()) {
					console.log("Access token has expired");
					res.ok({
						text: "Access token has expired"
					});
				}
				else{
					console.log("id = " + decoded.iss);
					let houseId = req.body.houseId;
					let userId = decoded.iss;
					let name = decoded.name;
					let content = req.body.content;
					let user = await User.findOne({
						id: userId
					});
					let avatar = user.avatar;
					console.log(user);
					console.log(avatar);
					await Comment.create({
						houseId: houseId,
						userId: userId,
						name: name,
						avatar: avatar,
						content: content,
						like: 0,
						dislike: 0,
					})
					
					res.ok({
						text: "comment create success",
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
};

