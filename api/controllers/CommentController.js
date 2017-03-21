/**
 * CommentController
 *
 * @description :: Server-side logic for managing comments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const jwt = require('jwt-simple');


module.exports = {
	
	createMyComment: function(req, res){
		var token = req.headers['x-access-token'];
		console.log("token = " + token);
		var secret = 'zzggzz';
		console.log(req.body.houseId);
		console.log(req.body.userId);
		console.log(req.body.name);
		console.log(req.body.content);
		if(token){
			try{
				var decoded = jwt.decode(token, secret);
				if (decoded.exp <= Date.now()) {
					res.ok({
						text: "Access token has expired"
					});
				}
				else{
					console.log("id = " + decoded.iss);
					var houseId = req.body.houseId;
					var userId = decoded.iss;
					var name = decoded.name;
					var content = req.body.content;
					Comment.create({
						houseId: houseId,
						userId: userId,
						name: name,
						content: content,
						like: 0,
						dislike: 0,
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
								text: "comment create success",
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
	
	findHouseComment: function(req, res){
		var houseId = req.body.houseId;
		console.log(req.body.houseId);
		try{
			var data = Comment.find({
				houseId: houseId
			}).exec(function(err, data){
				if(!data){
					res.notFound('comment not found');
				}
				else{
					console.log("data = " + data);
					res.ok({
						text: "comment create success",
						data: data,
					})
					
				}
			})
			
		}catch(error){
			console.log("catch error = " + error);
			res.ok({
				text: "something went wrong" + error
			})
		}
	},
};

