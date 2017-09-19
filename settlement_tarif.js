/*
 * Happy Hour 
 * ======================
 * 11:00-12:00
 */

var startTime=new Date(settlement.start.time*1000);
var endTime=new Date(settlement.end.time*1000);

console.log("Hours",startTime.getHours(),endTime.getHours());

if(endTime-startTime<3600000) { 				
	if((startTime.getHours()==8)&&(endTime.getHours()==8)) { 
		settlement.cost=0;
	} 
}

global.promise = new Promise(function(resolve2, reject2) { 
node.stromkontoproxy(global.smart_contract_stromkonto).then(function(sko) {
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