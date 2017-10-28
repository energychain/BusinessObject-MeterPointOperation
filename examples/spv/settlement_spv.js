
global.promise = new Promise(function(resolve2, reject2) { 		
	var txs = [];
	

		node.roleLookup().then(function(rl) {						
			rl.relations(settlement.account,43).then(function(tkn) {
				node.mptoken(tkn).then(function(t) {
					t.power_token().then(function(pt) {
						rl.relations(settlement.account,44).then(function(address_set) {
							console.log("Address Set",address_set);
							node.mpset(address_set).then(function(mpset) {	
								
								var proms=[];
								
								var noReject=true;
								var i=0;
								do {							
									proms.push(new Promise(function(resolve3, reject3) { 	
										mpset.meterpoints(i).then(function(mp) {								
											node.erc20token(pt).then(function(token) {
												token.balanceOf(mp).then(function(bal) {													
													tx={};
													tx.from=mp;
													tx.to=settlement.node_account;
													tx.value=settlement.cost*bal;
													tx.base=settlement.base*bal;	
													txs.push(tx);		
													resolve3();						
												});
											});
											j++;																
										}).catch(function(e) {
												noReject=false;
										});
										var ms=10000;
										 setTimeout(function() {
											 console.log('Promise timed out after ' + ms + ' ms');
												resolve3();
										}, ms);
									}));
									i++;
									if(i>100) noReject=false;
								} while(noReject);								
								Promise.all(proms)
								.then(values => {				
										console.log(txs);
										
										var processTx=function(tx) {
											var p1=new Promise(function(resolve3, reject3) {	
												node.stromkontoproxy(global.smart_contract_stromkonto).then(function(sko) {
													sko.addTx(tx.from,tx.to,tx.value,tx.base).then(function(txo) {
															console.log("TX",txo);
															resolve3();
													});
												});
											});
											return p1;
										}
										var proms2=[];	
										processTx(txs[0]).then(function() {
											processTx(txs[1]).then(function() {
												processTx(txs[2]).then(function() {
													resolve2();
												});
											});
										});
										/*									
										for(var i=0;i<txs.length;i++) {											
											proms2.push(processTx(txs[i]));												
										}
										
										Promise.all(proms2).then(values=> {
											resolve2();
										});									
										*/										
								});

							});				
						});	
					});		
				});				
			});
		});
	
	//
});
