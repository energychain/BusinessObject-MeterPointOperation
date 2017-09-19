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


