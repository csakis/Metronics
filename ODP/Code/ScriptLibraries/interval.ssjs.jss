function onInterval(){
  function addHello (){
	print("date: " + new Date());
	var current_db = session.getDatabase("","raven.nsf"); 
	var doc = current_db.createDocument();
	doc.appendItemValue("Form", "ping");
	doc.appendItemValue("date", "hello");
	doc.save();
	var ts = doc.getLastModified();
	var msg = websocketClient.createMessage();
	print('before');
	//var targets = new java.util.ArrayList();
	//targets.add("/raven.nsf*");
	//targets.add("/ravenListener");
	msg.addTarget("/ravenListener");
	//msg.setTo("/ravenListener");
	//msg.setTargets(targets);
	//print("targets: " + msg.getTargets());
	msg.setFrom('/ravenListener');
	print('after');	
	msg.getData().put("application", "raven");
	msg.setText("date is" +  new Date());
	websocketClient.sendMessage(msg);	
	
  }
  

 addHello();
}