/**
 * LikeController
 *
 * @description :: Server-side logic for managing likes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const jwt = require('jwt-simple');

module.exports = {
	
	addLike: async(req, res) => {
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
					console.log("user id = " + decoded.iss);
					var userId = decoded.iss;
					let repeatLike = await Like.findOne({
						commentId,
						userId,
						like: 1,
					});
					console.log(repeatLike);
					if(!repeatLike){
						console.log("null");
						await Like.create({
							commentId,
							userId,
							like: 1,
						})
						console.log("commentId = " + commentId);
						let newLike = await Like.find({
							commentId,
							like: 1,
						})
						await Comment.update({
							id: commentId
						}, {
							like: newLike.length
						})
						console.log("newLike.length = " + newLike.length);
						return res.ok({
							text: "like create success",
						})
					}
					console.log("repeatLike = ");
					console.log(repeatLike.id);
					await Like.destroy({
						id: repeatLike.id
					})
					let findLike = await Like.find({
						commentId,
						like: 1,
					})
					let like = findLike.length;
					console.log('like = ' + like);
					await Comment.update({
						id: commentId
					}, {
						like: like
					})
						
					return res.ok({
						text: "like destroy success"
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
	
	addDislike: async(req, res) => {
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
					console.log("user id = " + decoded.iss);
					var userId = decoded.iss;
					let repeatLike = await Like.findOne({
						commentId,
						userId,
						like: 2,
					});
					console.log(repeatLike);
					if(!repeatLike){
						console.log("null");
						await Like.create({
							commentId,
							userId,
							like: 2,
						})
						console.log("commentId = " + commentId);
						let newLike = await Like.find({
							commentId,
							like: 2,
						})
						await Comment.update({
							id: commentId
						}, {
							dislike: newLike.length
						})
						console.log("newLike.length = " + newLike.length);
						return res.ok({
							text: "like create success",
						})
					}else{
						console.log("repeatLike = ");
						console.log(repeatLike.id);
						await Like.destroy({
							id: repeatLike.id
						})
						let findLike = await Like.find({
							commentId,
							like: 2,
						})
						let like = findLike.length;
						console.log('like = ' + like);
						await Comment.update({
							id: commentId
						}, {
							dislike: like
						})
							
						return res.ok({
							text: "like destroy success"
						})
					}
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

