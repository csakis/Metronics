//function is called using x$("#{id:inputText1}", " parameters").
 
function x$(idTag, param){ //Updated 18 Feb 2012
   idTag=idTag.replace(/:/gi, "\\:")+(param ? param : "");
   return($("#"+idTag));
}

function xId(id){ 
   id=id.replace(/:/gi, "\\:");
   return "#" + id;
}


function log(log) {
  console.log("Time: " + (performance.now()/1000).toFixed(3) + " -> " + log);
}