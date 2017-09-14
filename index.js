#!/usr/bin/env node

const vorpal = require('vorpal')();
var srequest = require('sync-request');
const fs = require('fs');
const vm = require('vm');
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
  .option('-a <ipfs_hash>','Apply settlement/clearing from IPFS Hash')
  .option('-f <file>','Apply settlement/clearing from file')
  .option('--de <zipcode>','Add tarif for zipcode (Germany)')
  .action(function (args, callback) {	 
	var node = new StromDAOBO.Node({external_id:args.meter_point_id,testMode:true,abilocation:"https://cdn.rawgit.com/energychain/StromDAO-BusinessObject/master/smart_contracts/"});	
	node.storage.setItemSync(node.wallet.address,args.meter_point_id);
	node.mpr().then( function(mpo) {
			global.settlement={};
			global.node=node;
			var settlement_js="";
			if(typeof args.options.a != "undefined") {
				settlement_js = srequest('GET',"https://fury.network/ipfs/"+args.options.a+"").body.toString();				
			}
			if(typeof args.options.f != "undefined") {
				settlement_js = fs.readFileSync( args.options.f);
			}
			if(typeof args.options.de != "undefined") {
				settlement.tarif = JSON.parse(srequest('GET',"https://fury.network/tarifs/de/"+args.options.de+"").body.toString());				
			}
			settlement.account=node.wallet.address;
			settlement.node_account=node.nodeWallet.address;
			
			mpo.readings(node.wallet.address).then( function(start_reading) {
				settlement.start=start_reading;								
				mpo.storeReading(args.reading).then( function(tx_result) {	
					if(settlement_js.length>0) {
						mpo.readings(node.wallet.address).then( function(end_reading) {
							settlement.end=end_reading;
							var script = new vm.Script(settlement_js);
							script.runInThisContext();						
							callback();
						});
					} else {
						vorpal.log("TX:",tx_result);																	
						callback();
					}
				});
			});
	});	
});	

vorpal
  .command('retrieve <meter_point_id>')    
  .description("Retrieves Meter Point Reading for given external Meter Point ID.") 
  .action(function (args, callback) {	 
	var node = new StromDAOBO.Node({external_id:args.meter_point_id,testMode:true,abilocation:"https://cdn.rawgit.com/energychain/StromDAO-BusinessObject/master/smart_contracts/"});	
	node.storage.setItemSync(node.wallet.address,args.meter_point_id);
	node.mpr().then( function(mpo) {
			mpo.readings(node.wallet.address).then( function(tx_result) {								
				vorpal.log("Time:",new Date(tx_result.time.toString()*1000).toLocaleString());
				vorpal.log("Reading:",tx_result.power.toString());
				callback();									
			});			
	});	
});	


vorpal
  .command('ledger <meter_point_id>')    
  .description("Retrieve Ledger Information for meter point id (Stromkonto).") 
  .action(function (args, callback) {	 
	var node = new StromDAOBO.Node({external_id:args.meter_point_id,testMode:true,abilocation:"https://cdn.rawgit.com/energychain/StromDAO-BusinessObject/master/smart_contracts/"});	
	node.storage.setItemSync(node.wallet.address,args.meter_point_id);	
	node.stromkonto().then( function(sko) {
			vorpal.log("Address:",node.wallet.address);
			sko.balancesSoll(node.wallet.address).then(function(soll) {
				vorpal.log("Credit:",soll);
				sko.balancesHaben(node.wallet.address).then(function(haben) {
					vorpal.log("Debit:",haben);
					vorpal.log("Balance:",haben-soll);					
					sko.history(node.wallet.address,10000).then(function(history) {
						vorpal.log("Last Transaction");
						vorpal.log("Block","From","To","Value");						
						for(var i=0;i<history.length;i++) {
								var from=node.storage.getItemSync(history[i].from);
								if(from==null) {from=history[i].from;}
								
								var to=node.storage.getItemSync(history[i].to);
								if(to==null) {to=history[i].from;}
								
								vorpal.log(history[i].blockNumber,from,to,parseInt(history[i].value, 16));							
						}
						callback();	
					});
				});
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


