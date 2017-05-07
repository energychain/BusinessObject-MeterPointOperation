/* StromDAO Business Object: MeterPoint Operation
 * =========================================
 * Meter Point Operator handling for StromDAO Energy Blockchain.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * 
 * Usage: 
 *    stbo-mpo store YOUR_METERPOINT_ID READING
 *    stbo-mpo retrieve YOUR_METERPOINT_ID
 * 
 * This script will automatically assign a unique energy blockchain address for 
 * your meterpoint. 
 * 
 * If used in StromDAO-BO's MAIN BRANCH this will be defaulted to the testnet environment.
 * 
 */
 
var StromDAOBO = require("stromdao-businessobject");    

var userArgs = process.argv.slice(2);

if(userArgs.length<1) {
	console.log("Usage:");
	console.log(" stbo-mpo store meter_point_id value");	
	console.log(" stbo-mpo retrieve meter_point_id");
	process.exit(1);
}

var node = new StromDAOBO.Node({external_id:userArgs[1],testMode:true});
console.log("Mapping",userArgs[1]," is ",node.wallet.address);
	
if(userArgs[0]=="store") {
	if(userArgs.length<3) {
		console.log("ERR: Missing Reading");
		process.exit(1);
	}
    node.mpo().then( function(mpo) {
							mpo.storeReading(userArgs[2]).then( function(tx_result) {	
									console.log("Tx",tx_result,userArgs[2]);
							});
						});
}	
if(userArgs[0]=="retrieve") {
	node.mpo().then( function(mpo) {
							mpo.readings(node.wallet.address).then( function(tx_result) {	
									console.log(tx_result.time.toString(),tx_result.power.toString());									
							});
						});
}	
