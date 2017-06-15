
const jwt = require('jwt-simple');

module.exports = {
    
	addIssue: async(req, res) => {
	    console.log("***addIssue***");
		let token = req.headers['x-access-token'];
		console.log("token = " + token);
		let secret = 'zzggzz';
		let issue = req.body.issue;
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
					await Issue.create({
						userId,
						issue
					})
					return res.ok({
						text: "issue create success",
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
		
	},
	
	findUserLove: async(req, res) =>{
		console.log("***findUserLove***");
		const token = req.headers['x-access-token'];
		console.log("token = " + token);
		let secret = 'zzggzz';
		if(token){
			try{
				let decoded = jwt.decode(token, secret);
				if (decoded.exp <= Date.now()) {
					return res.ok({
						text: "Access token has expired"
					});
				}
				else{
					console.log("user id = " + decoded.iss);
					let userId = decoded.iss;
					let allLove = await Love.find({
						userId,
					});
					console.log(allLove);
					let allHouse = [];
					for(let i=0;i<allLove.length;i++){
						let newHouse = await House.findOne({id: allLove[i].houseId});
						allHouse = [...allHouse, newHouse]
					}
					return res.ok({
						text: 'find all success',
						data: allHouse
					})
				}
			}catch(e){
				
			}
		}else{
			return res.ok({
				text: "not have token"
			})
		}
	}
	
}