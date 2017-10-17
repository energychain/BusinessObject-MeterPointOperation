global.promise = new Promise(function(resolve2, reject2) { 
	settlement.cost=10000000; // =1,00 EUR
	node.stromkontoproxy(global.smart_contract_stromkonto).then(function(sko) {
			sko.addTx(settlement.account,settlement.node_account,settlement.cost,settlement.base).then(function(tx) {
					console.log("TX",tx);		
					console.log("From:",settlement.account);
					console.log("To:",settlement.node_account);
					console.log("Amount:",(Math.round(settlement.cost)/10000000).toFixed(6));
					console.log("Base:",(settlement.end.power.toString()*1-settlement.start.power.toString()*1));	
					resolve2(tx);
			});
	});
});
