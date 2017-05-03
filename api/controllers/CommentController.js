/**
 * CommentController
 *
 * @description :: Server-side logic for managing comments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	createMyComment: async (req, res) => {
		console.log("*******createMyComment*********");
		console.log(req.body.houseId);
		console.log(req.body.content);
		console.log(req.body.star);

		try {
			let decode=res.locals.decoded;
			
			console.log("id = " + decoded.iss);
			let houseId = req.body.houseId;
			let userId = decoded.iss;
			let name = decoded.name;
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
				if (val.star) {
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

		} catch (error) {
			console.log("catch error = " + error);
			res.ok({
				text: "something went wrong" + error
			})
		}

	},

	findHouseComment: function (req, res) {
		console.log("*******findHouseComment*********");
		let houseId = req.body.houseId;
		console.log(req.body.houseId);
		try {
			let data = Comment.find({
				houseId: houseId
			}).exec(function (err, data) {
				if (!data) {
					res.notFound('comment not found');
				}
				else {
					console.log("data = " + data);
					res.ok({
						text: "comment find success",
						data: data,
					})

				}
			})

		} catch (error) {
			console.log("catch error = " + error);
			res.ok({
				text: "something went wrong" + error
			})
		}
	},

	findBestComment: function (req, res) {
		let houseId = req.body.houseId;
		console.log(req.body.houseId);
		try {
			let data = Comment.find({
				where: { houseId: houseId },
				limit: 3,
				sort: 'like DESC'
			}).exec(function (err, data) {
				if (!data) {
					res.notFound('comment not found');
				}
				else {
					console.log("data = " + data);
					res.ok({
						text: "comment create success",
						data: data,
					})

				}
			})

		} catch (error) {
			console.log("catch error = " + error);
			res.ok({
				text: "something went wrong" + error
			})
		}
	},
};

