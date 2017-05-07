/*
 * StromDAO Business Object: MPO-VARTA Engion
 * =========================================
 * Varta ENGION Battery storage integratio for energy blockchain
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * 
 */

function storeReading(external_id,type,reading) {
	var p1 = new Promise(function(resolve, reject) {
	var node = new StromDAOBO.Node({external_id:external_id+"-"+type,testMode:true});	
	console.log("Mapping",external_id+"-"+type," is ",node.wallet.address);
	node.mpo().then( function(mpo) {							
							mpo.storeReading(reading).then( function(tx_result) {	
									resolve(tx_result);
							});
	});
	});
	return p1;
}

var StromDAOBO = require("stromdao-businessobject");    

var userArgs = process.argv.slice(2);

if(userArgs.length<1) {
	console.log("Usage:");
	console.log(" node vendor/varta.js ENGION_IP:PORT YOUR_ID");	
	process.exit(1);
}

request = require('request-json');
var client = request.createClient('http://'+userArgs[0]+'/');

client.get('cgi/info.js',function(err, res, body) {
	 eval(body);
	   if(typeof Device_Serial=="undefined") {
			  console.log('ERR: Unable to connect to Varta ENGION at http://'+userArgs[0]+'/');
			  process.exit(2);
		  }
	 device=Device_Description+"_"+Device_Serial;
		  
	 client.get('cgi/energy.js', function(err, res, body) {
		  eval(body);
		
		  if(typeof EGrid_AC_DC=="undefined") {
			  console.log('ERR: Unable to connect to Varta ENGION at http://'+userArgs[0]+'/');
			  process.exit(2);
		  }
		  
		  storeReading(device,"EGrid_AC_DC",EGrid_AC_DC)
		  .then(storeReading(device,"EGrid_DC_AC",EGrid_DC_AC))
		  .then(storeReading(device,"EWr_AC_DC",EWr_AC_DC))
		  .then(storeReading(device,"EWr_DC_AC",EWr_DC_AC));
		  return;
	});
	return;
});





