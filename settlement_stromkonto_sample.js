// Please refer to settlement_sample.js to see content of settlement object

// Tarif information:

// Currency Decimals = 6 (= 1000000 is 1€)

// Tarif: 3 per Wh, 2 per Minute 

var provider_address='0x381d512c237eC718d34b078b15ec5A90E47082D8'

var cost = (settlement.end.power.toString()*1-settlement.start.power.toString()*1)*3;
cost+=((settlement.end.time.toString()*1-settlement.start.time.toString()*1)/60)*2;
node.stromkontoproxy("0x19BF166624F485f191d82900a5B7bc22Be569895").then(function(sko) {
		sko.addTx(node.wallet.address,provider_address,Math.round(cost), (settlement.end.power.toString()*1-settlement.start.power.toString()*1)).then(function(tx) {
			console.log("TX Stronkonto:",tx);
			console.log("From:",node.wallet.address);
			console.log("To:",provider_address);
			console.log("Amount:",Math.round(cost));
			console.log("Base:",(settlement.end.power.toString()*1-settlement.start.power.toString()*1));
		});	
});
