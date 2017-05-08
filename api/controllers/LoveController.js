
const jwt = require('jwt-simple');

module.exports = {
    
	addLove: async(req, res) => {
	    console.log("***addLove***");
		let token = req.headers['x-access-token'];
		console.log("token = " + token);
		let secret = 'zzggzz';
		let houseId = req.body.houseId;
		console.log(req.body.houseId);
		if(token){
			try{
				let decoded = jwt.decode(token, secret);
				if (decoded.exp <= Date.now()) {
					res.ok({
						text: "Access token has expired"
					});
				}
				else{
					console.log("user id = " + decoded.iss);
					let userId = decoded.iss;
					let repeatLove = await Love.findOne({
						houseId,
						userId,
					});
					console.log(repeatLove);
					if(!repeatLove){
						console.log("null");
						await Love.create({
							houseId,
							userId,
						})
						console.log("houseId = " + houseId);
						let newLove = await Love.find({
							houseId,
							userId,
						})
						await House.update({
							id: houseId
						}, {
							love: newLove.length
						})
						console.log("newLove.length = " + newLove.length);
						return res.ok({
							text: "love create success",
						})
					}
					console.log("repeatLove = ");
					console.log(repeatLove.id);
					await Love.destroy({
						id: repeatLove.id
					})
					let findlove = await Love.find({
						houseId,
					})
					let love = findlove.length;
					console.log('love = ' + love);
					await House.update({
						id: houseId
					}, {
						love: love
					})
						
					return res.ok({
						text: "delete love success"
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
	
	findLove: async(req, res) => {
	    console.log("***findLove***");
		let token = req.headers['x-access-token'];
		console.log("token = " + token);
		let secret = 'zzggzz';
		let houseId = req.body.houseId;
		console.log(req.body.houseId);
		if(token){
		    try {
		        let decoded = jwt.decode(token, secret);
				if (decoded.exp <= Date.now()) {
					res.ok({
						text: "Access token has expired"
					});
				}
				else{
					console.log("user id = " + decoded.iss);
					let userId = decoded.iss;
					let repeatLove = await Love.findOne({
						houseId,
						userId,
					});
					console.log(repeatLove);
					if(!repeatLove){
						console.log("houseId = " + houseId);
						return res.ok({
							text: "null",
						})
					}else{
					    console.log("repeatLove = ");
    					console.log(repeatLove.id);
    						
    					return res.ok({
    						text: "love"
    					})
					}
					
				}
    		}catch(e){
    		    console.log(e);
    		}
		}else {
		    return res.ok({
				text: "not have token"
			})
		}
		
	}
	
}