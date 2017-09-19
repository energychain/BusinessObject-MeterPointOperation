var sko_sc="0x19BF166624F485f191d82900a5B7bc22Be569895";

function open_account() {
	node.stromkonto(sko_sc).then(function(sko) {
		    var account=$('#account').val();
			sko.balancesHaben(account).then(function(haben) {
				haben=haben/10000000;
				$('#account_haben').html(haben);
				$('#account_saldo').html($('#account_haben').html()-$('#account_soll').html());
			});
			sko.balancesSoll(account).then(function(soll) {
				soll=soll/10000000;
				$('#account_soll').html(soll);				
				$('#account_saldo').html($('#account_haben').html()-$('#account_soll').html());
			});
			$('#sko_blance').show();
			sko.history(account,10000).then(function(history) {
					history=history.reverse();
					var html="<table class='table table-striped'>";
					html+="<tr><th>Block</th><th>Von</th><th>An</th><th>Betrag</th>";
					console.log(history);
					$.each(history,function(i,v) {
						html+="<tr>";
						html+="<td>#"+v.blockNumber+"</td>";
						html+="<td>"+v.from+"</td>";
						html+="<td>"+v.to+"</td>";
						html+="<td>"+(parseInt(v.value, 16)/10000000)+"</td>";
					});
					html+="</table>";
					$('#history').html(html);
			});
	});
		node.mpr().then(function(mpr) {
			mpr.readings($('#account').val()).then(function(o) {
					d=new Date((o.time.toString())*1000);
					$('#ts').html(d.toLocaleString());
					$('#power').html(o.power.toString());				
			});
	});	
}

$.qparams = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return decodeURI(results[1]) || 0;
    }
}

var extid="1234";

if($.qparams("extid")!=null) {
		extid=$.qparams("extid");
}


var node = new document.StromDAOBO.Node({external_id:extid,testMode:true,rpc:"https://demo.stromdao.de/rpc",abilocation:"https://cdn.rawgit.com/energychain/StromDAO-BusinessObject/master/smart_contracts/"});

// Fill View (HTML) using JQuery
$('.account').html(node.wallet.address);
$('#account').val(node.wallet.address);
$('#open_account').click(open_account);
if($.qparams("sc")!=null) {
		sko_sc=$.qparams("sc");		
}
if($.qparams("account")!=null) {
		$('#account').val($.qparams("account"));
		open_account();
}
