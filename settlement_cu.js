function mpDeltaProcessing(mpset,mprset_old,mprset_new) {
	console.log("New MPRSet",mprset_new);
	var p1 = 	new Promise(function(resolve2, reject2) { 	
		node.mprset(mprset_old).then(function(readings_old) {
			node.mprset(mprset_new).then(function(readings_new) {
					delta_promise=[];
					for(var i=0;i<mpset.length;i++) {
						delta_promise.push(new Promise(function(res3,rej3) {
								var res=mpset[i];
								
								readings_old.mpr(mpset[i].mp).then(function(old_mp_reading) {
									old_mp_reading=old_mp_reading*1;
									res.reading_old=old_mp_reading;
									res3(res);									
									/*
									readings_new.mpr(mpset[i].mp).then(function(new_mp_reading) {
										new_mp_reading=new_mp_reading*1;
										mpset[i].old_reading=old_mp_reading;
										mpset[i].new_reading=new_mp_reading;
										mpset[i].delta_reading=Math.abs(new_mp_reading-	old_mp_reading);																			
									});
									*/									
								});
						}));
					}					
					Promise.all(delta_promise).then(function(values) {	
						delta_promise=[];
						for(var i=0;i<mpset.length;i++) {
						delta_promise.push(new Promise(function(res3,rej3) {
								var res=mpset[i];								
								readings_new.mpr(mpset[i].mp).then(function(old_mp_reading) {
									old_mp_reading=old_mp_reading*1;
									res.reading_new=old_mp_reading;
									res3(res);																									
								});
							}));
						}	
						
						Promise.all(delta_promise).then(function(values) {
							var sum_delta=0;
							for(var i=0;i<mpset.length;i++) {
								mpset[i].reading_delta=Math.abs(mpset[i].reading_new-mpset[i].reading_old);
								sum_delta+=mpset[i].reading_delta;
							}
							
							console.log("Distributing ",settlement.base," Energy to ",sum_delta," Utilization");
							if(sum_delta>0) {
									var factor=settlement.base/sum_delta;
									
									node.stromkontoproxy(global.smart_contract_stromkonto).then(function(sko) {
											var txs=[];
											for(var i=0;i<mpset.length;i++) {
												txs.push(new Promise(function(res3,rej3) {
														sko.addTx(mpset[i].mp,settlement.account,Math.round(settlement.cost*factor),Math.round(settlement.base*factor)).then(function(tx) {
																console.log(tx);
																res3(tx);
														});
												}));
											}
											Promise.all(txs).then(function(values) {
												resolve2();	
											});
									});								
							} else {
								console.log("ERROR: No split available");
								resolve2();								
							}
						});
					});					
			});
		});
	});
	return p1;	
}

global.promise = new Promise(function(resolve2, reject2) { 	
	node.roleLookup().then(function(rl) {	
		rl.relations(settlement.account,44).then(function(mpset_address) {	
			console.log("MPSet",mpset_address);
			node.mpset(mpset_address).then(function(mpset) {				
				var j=100;
				var mps=[];				
				for(var i=0;i<j;i++) {
					mps.push(new Promise(function(res3,rej3) {							
						mpset.meterpoints(i).then(function(mp) {
							node.mpr().then(function(mpr) {
								mpr.readings(mp).then(function(reading) {
										res={};
										res.mp=mp;
										res.reading=reading;
										res3(res);
								});								
							});						
							j++;							
						}).catch(function(e) {res3();});									
					}));
				}
				Promise.all(mps).then(function(values) {
					var mps=[];
					for(var i=0;i<values.length;i++) {
						if(typeof values[i] != "undefined") {
							mps.push(values[i]);
						}						
					}
					rl.relations(settlement.account,45).then(function(old_mprset_address) {								
							node.mprsetfactory().then(function(mprsf) {
								mprsf.build(mpset_address,"0x0000000000000000000000000000000000000008").then(function(mprset_address) {
									rl.setRelation(45,mprset_address).then(function(tx) {										
										mpDeltaProcessing(mps,old_mprset_address,mprset_address).then(function(tx) {										
											resolve2("finished");			
										});										
									});					
								});						
							});
					});
					
										
								
				}).catch(function(e) { reject2(e); });																
			});
		});		
	});
	
	/*
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
	*/
});
