function onBeforeMessage(msg){	
 
 // print("I am onBeforeMessage in observer");
}

function onMessage(msg){
 // print("I am onMessage in observer: " + msg);
}

function onError(error){
}

function onOpen(user){
	print(user.getUserId() + " has logged in.");
}

function onClose(user){
	print(user.getUserId() + " has left.");
}