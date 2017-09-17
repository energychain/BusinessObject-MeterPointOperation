#!/usr/bin/env node

const vorpal = require('vorpal')();
var srequest = require('sync-request');
const fs = require('fs');
const vm = require('vm');
var interactive = vorpal.parse(process.argv, {use: 'minimist'})._ === undefined;
const Hapi = require('hapi');

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

function cmd_store(args, callback) {	 
	var node = new StromDAOBO.Node({external_id:args.meter_point_id,testMode:true,abilocation:"https://cdn.rawgit.com/energychain/StromDAO-BusinessObject/master/smart_contracts/"});	
	node.storage.setItemSync(node.wallet.address,args.meter_point_id);
	node.mpr().then( function(mpo) {
			global.settlement={};
			global.node=node;
			var settlement_js="";
			var BpGross=0;
			var UpGross=0;
			var cost=0;
			if(typeof args.options.auto != "undefined") {
					args.options.a="QmQZ3v3Q9T99oXjmuaUkcceE3sRFDWdwU59pCS32qADFYA";
					args.options.de=args.options.auto;	
			}
			if(typeof args.options.a != "undefined") {
				settlement_js = srequest('GET',"https://fury.network/ipfs/"+args.options.a+"").body.toString();				
			}
			if(typeof args.options.f != "undefined") {
				settlement_js = fs.readFileSync( args.options.f);
			}
			if(typeof args.options.de != "undefined") {
				settlement.tarif = JSON.parse(srequest('GET',"https://fury.network/tarifs/de/"+args.options.de+"").body.toString());	


				for (var k in settlement.tarif){
					if (settlement.tarif.hasOwnProperty(k)) {		
						BpGross	=settlement.tarif[k].BpGross*10000000;
						UpGross=settlement.tarif[k].UpGross*100000;		
						settlement.zipcode=settlement.tarif[k].Zipcode;
					}
				}	
				settlement.BpGross=BpGross;
				settlement.UpGross=UpGross;		
				
				
			}
			settlement.account=node.wallet.address;
			settlement.node_account=node.nodeWallet.address;
			
			mpo.readings(node.wallet.address).then( function(start_reading) {
				settlement.start=start_reading;								
				mpo.storeReading(args.reading).then( function(tx_result) {	
					if((settlement_js.length>0)&&(settlement.start.power>0)) {
						mpo.readings(node.wallet.address).then( function(end_reading) {
							settlement.end=end_reading;
							var cost=0;
							var kwh=(settlement.end.power-settlement.start.power)/1000;
							cost+=Math.round(kwh*UpGross);
							
							var time=(settlement.end.time-settlement.start.time)/(365*86400);
							cost+=Math.round(time*BpGross);
							settlement.cost=cost;
							settlement.base=(settlement.end.power.toString()*1-settlement.start.power.toString()*1);
							var script = new vm.Script(settlement_js);
							var result=script.runInThisContext();	
							if(typeof global.promise!="undefined") { 
									global.promise.then(function(tx) {
										console.log(tx);
										callback();		
									});
							} else {
									callback();
							}												
						});
					} else {
						vorpal.log("TX:",tx_result);																	
						callback();
					}
				});
			});
	});	
}	

vorpal
  .command('store <meter_point_id> <reading>')    
  .description("Stores Meter Point Reading for given external Meter Point ID.") 
  .option('-a <ipfs_hash>','Apply settlement/clearing from IPFS Hash')
  .option('-f <file>','Apply settlement/clearing from file')
  .option('--de <zipcode>','Add tarif for zipcode (Germany)')
  .option('--auto <zipcode>','Auto settle to dev/testing ledger (only Germany)')
  .action(cmd_store);	

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
  .command('account <meter_point_id>')    
  .description("Get Address an keys for given external Meter Point ID.") 
  .option('--import <privateKey>','Import private Key as Meter Point. Add PKI infront of key!')
  .action(function (args, callback) {	 
	if(typeof args.options.import != "undefined") {
		console.log(args.options.import);
		var node = new StromDAOBO.Node({external_id:args.meter_point_id,privateKey:args.options.import.substr(3),testMode:true,abilocation:"https://cdn.rawgit.com/energychain/StromDAO-BusinessObject/master/smart_contracts/"});	
	} else {
		var node = new StromDAOBO.Node({external_id:args.meter_point_id,testMode:true,abilocation:"https://cdn.rawgit.com/energychain/StromDAO-BusinessObject/master/smart_contracts/"});	
	}
	vorpal.log("MPID",args.meter_point_id);
	vorpal.log("Address",node.wallet.address);
	vorpal.log("Node",node.nodeWallet.address);
	vorpal.log("Private Key","PKI"+node.wallet.privateKey);
	vorpal.log("RSA Public Key",node.RSAPublicKey);
	vorpal.log("RSA Private Key",node.RSAPrivateKey);
	callback();
});
vorpal
  .command('credit <meter_point_id> <amount>')    
  .description("Add credit to Meter Point ledger.") 
  .action(function (args, callback) {	 
	var node = new StromDAOBO.Node({external_id:args.meter_point_id,testMode:true,abilocation:"https://cdn.rawgit.com/energychain/StromDAO-BusinessObject/master/smart_contracts/"});	
	node.storage.setItemSync(node.wallet.address,args.meter_point_id);
	node.stromkontoproxy("0x19BF166624F485f191d82900a5B7bc22Be569895").then(function(sko) {
			sko.addTx(node.nodeWallet.address,node.wallet.address,args.amount,0).then(function(tx) {
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
vorpal
  .command('httpservice')    
  .description("Start Lacy Webservice") 
  .action(function (args, callback) {	 
	
	const server = new Hapi.Server();
	server.connection({ 
		host: 'localhost', 
		port: 8000 
	});

	server.route({
		method: 'GET',
		path:'/store/', 
		handler: function (request, reply) {
			var res={}
			if(typeof request.query.meter_point_id == "undefined") {
					res.err="Missing GET parameter: meter_point_id";
					return reply(res);
			} else if(typeof request.query.reading == "undefined") {
					res.err="Missing GET parameter: reading";
					return reply(res);
			} else {
				args={};
				args.meter_point_id=request.query.meter_point_id;
				args.reading=request.query.reading;
				args.options=request.query;
				
				return cmd_store(args,function() {reply("transmitted");});
			}		 
		}
	});


	server.register(require('inert'), (err) => {

		if (err) {
			throw err;
		}

		server.route({
			method: 'GET',
			path: '/{param*}',
			handler: {
				directory: {
					path: 'static/'
				}
			}
		});

		
	});
	server.start((err) => {

		if (err) {
			throw err;
		}
		console.log(`Server running at: ${server.info.uri}`);
		//callback();
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


