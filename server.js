var StromDAOBO = require("stromdao-businessobject");   
const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});

server.route({
    method: 'GET',
    path:'/store', 
    handler: function (request, reply) {
		var res={}
		if(typeof request.query.mpid == "undefined") {
				res.err="Missing GET parameter: mpid";
				return reply(res);
		} else 
		if(typeof request.query.reading == "undefined") {
				res.err="Missing GET parameter: reading";
				return reply(res);
		} else {
			var node = new StromDAOBO.Node({external_id:request.query.mpid,testMode:true});
			  node.mpo().then( function(mpo) {
							mpo.storeReading(request.query.reading).then( function(tx_result) {	
									res.tx=tx_result;
									res.mpid=request.query.mpid;
									res.reading=request.query.reading;
									res.address=node.wallet.address;
								    return reply(res);
							});
			});
		}		 
    }
});

server.route({
    method: 'GET',
    path:'/retrieve', 
    handler: function (request, reply) {
		var res={}
		if(typeof request.query.mpid == "undefined") {
				res.err="Missing GET parameter: mpid";
				return reply(res);
		} else 
		{
			var node = new StromDAOBO.Node({external_id:request.query.mpid,testMode:true});
				node.mpo().then( function(mpo) {
							mpo.readings(node.wallet.address).then( function(tx_result) {	
									res.time=(tx_result.time.toString()*1);
									res.reading=(tx_result.power.toString()*1);
									res.mpid=request.query.mpid;
									res.address=node.wallet.address;
								    return reply(res);								
							});
						});			 
		}		 
    }
});
server.route({
    method: 'GET',
    path:'/blockchain', 
    handler: function (request, reply) {
		var res={}
		if(typeof request.query.address == "undefined") {
				res.err="Missing GET parameter: address";
				return reply(res);
		} else 
		{
			var node = new StromDAOBO.Node({external_id:request.query.mpid,testMode:true});
			node.mpo().then( function(mpo) {
							mpo.readings(request.query.address).then( function(tx_result) {	
									res.time=(tx_result.time.toString()*1);
									res.reading=(tx_result.power.toString()*1);
									res.address=request.query.address;								
							});
						});
		}		 
    }
});
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
