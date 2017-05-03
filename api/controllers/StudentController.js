/**
 * StudentController
 *
 * @description :: Server-side logic for managing students
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const jwt = require('jwt-simple'); //for register and login function

module.exports = {

	login: function (req, res) {
		try {
			var account = req.body.account;
			var password = req.body.password;
			var secret = 'zzggzz';
			var result = Student.findOne({
				account: account,
				password: password,
			}).exec(function (err, data) {
				if (err) {
					return res.serverError(err);
				}
				if (!data) {
					return res.notFound('Could not find Finn, sorry.');
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
				}, {
						token: token
					}).exec(function (err, updated) {
						if (err) {
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
		} catch (err) {
			console.log("catch error = " + err);
			res.serverError(err);
		}
	},

	register: function (req, res) {
		try {
			var name = req.body.name;
			var gender = req.body.gender;
			var email = req.body.email;
			var account = req.body.account;
			var password = req.body.password;
			var secret = 'zzggzz';
			var newStudent = Student.create({
				name: name,
				gender: gender,
				email: email,
				account: account,
				password: password,
			})
				.then(function () {

					var result = Student.findOne({
						account: account,
						password: password,
					}).exec(function (err, data) {
						if (err) {
							console.log(err);
							return res.ok({
								text: 'Student not found'
							})
						}
						if (!data) {
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
						var token = jwt.encode({
							iss: data.id,
							exp: expires,
							name: data.name
						}, secret);
						Student.update({
							account: account,
							password: password
						}, {
								token: token
							}).exec(function (err, updated) {
								if (err) {
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
		} catch (e) {
			res.serverError(e);
		}
	},

	checkAuth: function (req, res) {
		try {
			let decode = res.locals.decoded;

			Student.findOne({ id: decoded.iss }).exec(function (err, data) {
				if (err) {
					console.log("error = " + err);
					return res.ok({
						text: "Student not found"
					})
				}
				if (!data) {
					return res.ok({
						text: "student not data",
					})
				}
				else {
					return res.ok({
						text: "check success",
						name: data.name
					})
				}
			})


		} catch (error) {
			console("catch error = " + error);
			return res.ok({
				text: "something went wrong"
			})
		}
	}
};