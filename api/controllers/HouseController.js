/**
 * HouseController
 *
 * @description :: Server-side logic for managing houses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: function (req, res) {
		var result = House.find({})
			.then(function (data) {
				res.ok({
					text: "find success",
					data: data,
				})
			})
	},

	findMyHouse: function (req, res) {
		try {
			let decoded = res.locals.decoded;
			House.find({ landlordId: decoded.iss }).exec(function (err, findData) {
				if (err) {
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
		} catch (error) {
			console.log("catch error = " + error);
			res.ok({
				text: "something went wrong" + error
			})
		}
	},

	createMyHouse: async (req, res) => {
		try {
			let decoded = res.locals.decoded;
			console.log(req.body.title);
			console.log(req.body.area);

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
				checkele: req.body.checkele,
				checknet: req.body.checknet,
				type: req.body.type,
				landlordId: decoded.iss,
				phone: phone,
				score: 0,
			}).exec(function (err, data) {
				if (err) {
					console.log("error = " + err);
					res.ok({
						text: "house create not success"
					})
				}
				else {
					console.log("data = " + data);
					res.ok({
						text: "house create success",
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

	updateMyHouse: function (req, res) {
		try {
			let decoded = res.locals.decoded;
			console.log(req.body.title);
			console.log(req.body.area);
			console.log(req.body.id);
			House.update({
				id: req.body.id
			}, {
					title: req.body.title,
					area: req.body.area,
					address: req.body.address,
					vacancy: req.body.vacancy,
					rent: req.body.rent,
					checkwater: req.body.checkwater,
					checkele: req.body.checkele,
					checknet: req.body.checknet,
					type: req.body.type,
				}).exec(function (err, data) {
					if (err) {
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
		} catch (error) {
			console.log("catch error = " + error);
			res.ok({
				text: "something went wrong" + error
			})
		}

	},

	findFilterHouse: function (req, res) {
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
		if (rent == 0) {
			rent = 3000
		}
		House.find({
			area: area,
			type: type
		}).exec(function (err, data) {
			if (err) {
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

	findTheHouse: async (req, res) => {
		try {
			let id = req.body.houseId;
			let findHouse = await House.findOne({
				id
			});
			if (!findHouse) {
				console.log('house not found');
				return res.ok({
					text: 'house not found'
				});
			}
			else {
				console.log(findHouse);
				return res.ok({
					text: 'house find success',
					data: findHouse,
				})
			}
		} catch (error) {
			console.log("catch error = " + error);
			res.ok({
				text: "something went wrong" + error
			})
		}
	},

	findHouseData: async (req, res) => {
		try {
			let findHouse = await House.find({});
			if (!findHouse) {
				console.log('house is null');
				return res.ok({
					text: 'house is null'
				});
			}
			else {
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
				return res.ok({
					text: 'house find success',
					data: newHouse,
				})
			}
		} catch (error) {
			console.log("catch error = " + error);
			res.ok({
				text: "something went wrong" + error
			})
		}
	}
};

