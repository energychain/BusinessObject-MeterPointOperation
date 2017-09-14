var provider_address='0x381d512c237eC718d34b078b15ec5A90E47082D8';

var BpGross=0;
var UpGross=0;
var cost=0;

for (var k in settlement.tarif){
    if (settlement.tarif.hasOwnProperty(k)) {		
		BpGross	=settlement.tarif[k].BpGross*10000000;
		UpGross=settlement.tarif[k].UpGross*100000;		
    }
}

if((BpGross>0)&&(UpGross>0)) {
	var kwh=(settlement.end.power-settlement.start.power)/1000;
	cost+=Math.round(kwh*UpGross);
	
	var time=(settlement.end.time-settlement.start.time)/(365*86400);
	cost+=Math.round(time*BpGross);
	
	node.stromkontoproxy("0x19BF166624F485f191d82900a5B7bc22Be569895").then(function(sko) {
		sko.addTx(node.wallet.address,provider_address,Math.round(cost), (settlement.end.power.toString()*1-settlement.start.power.toString()*1)).then(function(tx) {
				console.log("TX",tx);		
				console.log("From:",node.wallet.address);
				console.log("To:",provider_address);
				console.log("Amount:",(Math.round(cost)/10000000).toFixed(6));
				console.log("Base:",(settlement.end.power.toString()*1-settlement.start.power.toString()*1));	
		});
	});
}
