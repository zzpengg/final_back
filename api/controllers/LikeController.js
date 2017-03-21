/**
 * LikeController
 *
 * @description :: Server-side logic for managing likes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const jwt = require('jwt-simple');

module.exports = {
	addLike: function(req, res){
		var token = req.headers['x-access-token'];
		console.log("token = " + token);
		var secret = 'zzggzz';
		var commentId = req.body.commentId;
		console.log(req.body.commentId);
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
					var userId = decoded.iss;
					Like.create({
						commentId: commentId,
						userId: userId,
						like: 1,
					}).exec(function(err,data){
						if(err){
							console.log("error = " + err);
							res.ok({
								text: "like create not success"
							})
						}
						else{
							Comment.find({
								id: commentId
							}).exec(function(err, data){
								var like = data.like || 0;
								console.log("like = " + like);
								like = like + 1;
								Comment.update({
									id: commentId
								},{
									like: like
								}).exec(function(err, data){
									console.log("dataLike = " + data[0].like);
									console.log("data = " + data);
									res.ok({
										text: "like create success",
									})
								})
								
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
	
	addDislike: (req, res) => {
		var token = req.headers['x-access-token'];
		console.log("token = " + token);
		var secret = 'zzggzz';
		var commentId = req.body.commentId;
		console.log(req.body.commentId);
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
					var userId = decoded.iss;
					Like.create({
						commentId: commentId,
						userId: userId,
						like: 0,
					}).exec(function(err,data){
						if(err){
							console.log("error = " + err);
							res.ok({
								text: "dislike create not success"
							})
						}
						else{
							console.log("data = " + data);
							res.ok({
								text: "dislike create success",
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
	
	delLike: function(req, res){
		var token = req.headers['x-access-token'];
		console.log("token = " + token);
		var secret = 'zzggzz';
		var likeId = req.body.likeId;
		console.log(likeId);
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
					var userId = decoded.iss;
					Like.destroy({
						id: likeId,
					}).exec(function(err,data){
						if(err){
							console.log("error = " + err);
							res.ok({
								text: "like destroy not success"
							})
						}
						else{
							console.log("data = " + data);
							res.ok({
								text: "like destroy success",
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
	
	delDislike: function(req, res){
		var token = req.headers['x-access-token'];
		console.log("token = " + token);
		var secret = 'zzggzz';
		var disLikeId = req.body.disLikeId;
		console.log(disLikeId);
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
					var userId = decoded.iss;
					Like.destroy({
						id: disLikeId,
					}).exec(function(err,data){
						if(err){
							console.log("error = " + err);
							res.ok({
								text: "dislike destroy not success"
							})
						}
						else{
							console.log("data = " + data);
							res.ok({
								text: "dislike destroy success",
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
};

