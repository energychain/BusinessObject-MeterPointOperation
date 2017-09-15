// unser Tarif: pro Wh 13 

var provider_address='0x381d512c237eC718d34b078b15ec5A90E47082D8'

var cost = (settlement.end.power.toString()*1-settlement.start.power.toString()*1)*0;

node.stromkontoproxy("0x19BF166624F485f191d82900a5B7bc22Be569895").then(function(sko) {
		var person_a="0xEAA8789b2f942d66A880731ffFD24f56E87Cf809";
		var person_b="0xA61BcE2B44E10aa1a14e1CEeeCE1768f4ACF9fD3";
		
		sko.addTx(person_a,provider_address,Math.round(cost/2), (settlement.end.power.toString()*1-settlement.start.power.toString()*1)).then(function(tx) {
			console.log("TX Stronkonto:",tx);
			console.log("From:",node.wallet.address);
			console.log("To:",provider_address);
			console.log("Amount:",Math.round(cost));
			console.log("Base:",(settlement.end.power.toString()*1-settlement.start.power.toString()*1));
			sko.addTx(person_b,provider_address,Math.round(cost/2), (settlement.end.power.toString()*1-settlement.start.power.toString()*1)).then(function(tx) {
				console.log("TX Stronkonto:",tx);
				console.log("From:",node.wallet.address);
				console.log("To:",provider_address);
				console.log("Amount:",Math.round(cost));
				console.log("Base:",(settlement.end.power.toString()*1-settlement.start.power.toString()*1));
			});	
		});			
});

