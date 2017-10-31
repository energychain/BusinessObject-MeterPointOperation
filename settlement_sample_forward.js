global.promise = new Promise(function(resolve2, reject2) { 
	node.stromkontoproxy(global.smart_contract_stromkonto).then(function(sko) {
			sko.addTx(settlement.account,settlement.node_account,settlement.cost,settlement.base).then(function(tx) {
					console.log(settlement.node_account,cutkn,cost,settlement.base,tx);
					resolve2(tx);
			});
	});
});
