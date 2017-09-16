var sko_sc="0x19BF166624F485f191d82900a5B7bc22Be569895";

global.promise = new Promise(function(resolve2, reject2) { 
	node.stromkontoproxy("0x19BF166624F485f191d82900a5B7bc22Be569895").then(function(sko) {
			sko.addTx(node.wallet.address,node.nodeWallet.address,settlement.cost,settlement.base).then(function(tx) {
					console.log("TX",tx);		
					console.log("From:",node.wallet.address);
					console.log("To:",node.nodeWallet.address);
					console.log("Amount:",(Math.round(settlement.cost)/10000000).toFixed(6));
					console.log("Base:",(settlement.end.power.toString()*1-settlement.start.power.toString()*1));	
					resolve2(tx);
			});
	});
});