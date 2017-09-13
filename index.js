#!/usr/bin/env node

const vorpal = require('vorpal')();
var interactive = vorpal.parse(process.argv, {use: 'minimist'})._ === undefined;

/* StromDAO Business Object: MeterPoint Operation
 * =========================================
 * Meter Point Operator handling for StromDAO Energy Blockchain.
 * 
 * @author Thorsten Zoerner thorsten.zoerner@stromdao.de 
 * 
 * Usage: 
 *    stromdao-mp store YOUR_METERPOINT_ID READING
 *    stromdao-mp retrieve YOUR_METERPOINT_ID
 * 
 * This script will automatically assign a unique energy blockchain address for 
 * your meterpoint. 
 * 
 * If used in StromDAO-BO's MAIN BRANCH this will be defaulted to the testnet environment.
 * 
 */
 
var StromDAOBO = require("stromdao-businessobject");    


vorpal
  .command('store <meter_point_id> <reading>')    
  .description("Stores Meter Point Reading for given external Meter Point ID.") 
  .action(function (args, callback) {	 
	var node = new StromDAOBO.Node({extid:args.meter_point_id,testMode:true,abilocation:"https://cdn.rawgit.com/energychain/StromDAO-BusinessObject/master/smart_contracts/"});	
	node.mpr().then( function(mpo) {
			mpo.storeReading(args.reading).then( function(tx_result) {	
					vorpal.log("TX:",tx_result);
					callback();
			});
	});	
});	

vorpal
  .command('retrieve <meter_point_id>')    
  .description("Retrieves Meter Point Reading for given external Meter Point ID.") 
  .action(function (args, callback) {	 
	var node = new StromDAOBO.Node({extid:args.meter_point_id,testMode:true,abilocation:"https://cdn.rawgit.com/energychain/StromDAO-BusinessObject/master/smart_contracts/"});	
	node.mpr().then( function(mpo) {
			mpo.readings(node.wallet.address).then( function(tx_result) {								
				vorpal.log("Time:",new Date(tx_result.time.toString()*1000).toLocaleString());
				vorpal.log("Reading:",tx_result.power.toString());
				callback();									
			});			
	});	
});	


if (interactive) {
    vorpal
        .delimiter('stromdao-mp $')
        .show()
} else {
    // argv is mutated by the first call to parse.
    process.argv.unshift('')
    process.argv.unshift('')
    vorpal
        .delimiter('')
        .parse(process.argv)
}


/*
var userArgs = process.argv.slice(2);

if(userArgs.length<1) {
	console.log("Usage:");
	console.log(" stbo-mpo store meter_point_id value");	
	console.log(" stbo-mpo retrieve meter_point_id");
	console.log(" stbo-mpo blockchain blockchain_address");
	process.exit(1);
}

var node = new StromDAOBO.Node({external_id:userArgs[1],testMode:true});
console.log("Mapping",userArgs[1]," is ",node.wallet.address);
	
if(userArgs[0]=="store") {
	if(userArgs.length<3) {
		console.log("ERR: Missing Reading");
		process.exit(1);
	}
    
}	
if(userArgs[0]=="retrieve") {
	node.mpo().then( function(mpo) {
							mpo.readings(node.wallet.address).then( function(tx_result) {	
									console.log(tx_result.time.toString(),tx_result.power.toString());									
							});
						});
}	
if(userArgs[0]=="blockchain") {
	node.mpo().then( function(mpo) {
							mpo.readings(userArgs[1]).then( function(tx_result) {	
									console.log(tx_result.time.toString(),tx_result.power.toString());									
							});
						});
}	
*/
