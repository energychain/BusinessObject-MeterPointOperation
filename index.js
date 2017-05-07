/*
 *
 */
 
var StromDAOBO = require("stromdao-businessobject");    
var known_rolelookup = '0xbc723c385dB9FC5E82e301b8A7aa45819E4c3e8B';
var known_mpo = '0xc4719B91742D052d0A93F513f59F6Ac15e95D061';
var known_dso = '0x7a0134578718b171168A7Cf73b861662E945a4D3';

var userArgs = process.argv.slice(2);

if(userArgs.length<1) {
	console.log("Usage:");
	console.log(" stbo-mpo store meter_point_id value");	
	console.log(" stbo-mpo retrieve BC_Meter_Point");
	console.log(" stbo-mpo setRoles meter_point_id");	
	process.exit(1);
}

var node = new StromDAOBO.Node({external_id:userArgs[1]c);
	
if(userArgs[0]=="store") {
 console.log("Mapping",userArgs[1]," is ",node.wallet.address);
 node.mpo(known_mpo).then( function(mpo) {
							mpo.storeReading(userArgs[2]).then( function(tx_result) {	
									console.log("Tx",tx_result,userArgs[2]);
							});
						});
}	
if(userArgs[0]=="retrieve") {
	node.mpo(known_mpo).then( function(mpo) {
							mpo.readings(userArgs[1]).then( function(tx_result) {	
									console.log("Time",tx_result.time.toString());
									console.log("Reading",tx_result.power.toString());
							});
						});
}	
if(userArgs[0]=="setRoles") {
	    console.log("Mapping",userArgs[1]," is ",node.wallet.address);
		node.roleLookup(known_rolelookup).then( function(roleLookup) {
				roleLookup.setRelation('0x0ccE513Fc5581F636830D15ddA7eD211c211aa63',known_mpo).then( function(tx_result) {	
						console.log("Role Tx",tx_result);
						node.mpo(known_mpo).then( function(mpo) {
								mpo.approveMP(node.wallet.address,4).then( function(tx_result) {	
										console.log("MPO Tx",tx_result);
											node.dso(known_dso).then( function(dso) {
											dso.approveConnection(node.wallet.address,1000000).then( function(tx_result) {	
													console.log("DSO Tx",tx_result);
													node.roleLookup(known_rolelookup).then( function(roleLookup) {
														roleLookup.setRelation('0x72467342DcC4b072AeDB2C4242D98504fa22b17A',known_dso).then( function(tx_result) {	
															
														});
													});
											});
										});
								});
						});
				});
		});
		

}				
