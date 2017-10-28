global.promise = new Promise(function(resolve2, reject2) { 
	node.stromkontoproxy(global.smart_contract_stromkonto).then(function(sko) {
		
			// Assume 1 KWh = 0,10 €
			var cost= settlement.base*100000;
			var base= settlement.base;
			
			node.roleLookup().then(function(rl) {
				rl.relations(settlement.account,45).then(function(cutkn) {
					node.cutoken(cutkn).then(function(ct) {
						ct.totalSupply().then(function(ts) {
								ct.balanceOf(settlement.account).then(function(bal) {
									cost*=bal/ts;
									base*=bal/ts;
									sko.addTx(settlement.account,settlement.node_account,Math.round(cost),Math.round(base)).then(function(tx) {
										console.log("TX",tx);		
										console.log("From:",settlement.account);
										console.log("To:",settlement.node_account);
										console.log("Amount:",(Math.round(cost)/10000000).toFixed(6));
										console.log("Base:",base*1);	
									resolve2(tx);
								});								
							});
						});
					});
				});				
			});
	});
});

