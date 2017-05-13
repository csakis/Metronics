var CURRENT_DB = session.getDatabase("","raven.nsf"); 

function saveChat (msg) {
	var data = msg.getData();
	var doc = CURRENT_DB.createDocument();
	doc.appendItemValue("Form", "chat");
	doc.appendItemValue("eventId", data.get("event"));
	doc.appendItemValue("chatTab", data.get("chatTab"));
	doc.appendItemValue("sender", msg.getFrom());
	doc.appendItemValue("date", data.get("date"));
	doc.appendItemValue("message", msg.getText());
	doc.save();
}

function saveFeedback (msg) {
	var data = msg.getData();
	var feedback = data.get("feedback");
	var doc = CURRENT_DB.createDocument();
	doc.appendItemValue("Form", "feedback");
	doc.appendItemValue("feedbackBrowser", feedback.get('browser'));
	doc.appendItemValue("feedbackContent", feedback.get('message'));
	doc.appendItemValue("feedbackResolution", feedback.get('resolution'));
	doc.appendItemValue("feedbackType", feedback.get('type'));
	doc.appendItemValue("feedbackUser", msg.getFrom());
	doc.appendItemValue("feedbackDate", data.get('date'));
	doc.save();
}

function updateUser(msg) {
	var data = msg.getData();
	var userData = data.get("user");
	var users = CURRENT_DB.getView("users");
	var userDocs = users.getAllDocumentsByKey(msg.getFrom());

	if (userDocs.getCount() == 0) {
	//we have a new user
		var newUser = CURRENT_DB.createDocument();
		newUser.appendItemValue("Form", "user");
		newUser.appendItemValue("userName", msg.getFrom());
		newUser.appendItemValue("firstName", userData.get('firstName'));
		newUser.appendItemValue("lastName", userData.get('lastName'));
		newUser.appendItemValue("email", userData.get('email'));
		newUser.appendItemValue("classifiedEmail", userData.get('classifiedEmail'));
		newUser.appendItemValue("organization", userData.get('organization'));
		newUser.appendItemValue("position", userData.get('position'));
		newUser.appendItemValue("phone", userData.get('phone'));
		newUser.appendItemValue("cellPhone", userData.get('cellPhone'));
		newUser.appendItemValue("securePhone", userData.get('securePhone'));
		newUser.appendItemValue("theme", userData.get('theme'));
		newUser.save();
		return ;
	}
	if (userDocs.getCount() > 1) {
		print("we have a serious issue with the users view. There are multiple users with the same name");
		return ;
	}
	//update user with new values
	var user = userDocs.getFirstDocument();
	user.replaceItemValue("Form", "user");
	user.replaceItemValue("firstName", userData.get('firstName'));
	user.replaceItemValue("lastName", userData.get('lastName'));
	user.replaceItemValue("email", userData.get('email'));
	user.replaceItemValue("classifiedEmail", userData.get('classifiedEmail'));
	user.replaceItemValue("organization", userData.get('organization'));
	user.replaceItemValue("position", userData.get('position'));
	user.replaceItemValue("phone", userData.get('phone'));
	user.replaceItemValue("cellPhone", userData.get('cellPhone'));
	user.replaceItemValue("securePhone", userData.get('securePhone'));
	user.replaceItemValue("theme", userData.get('theme'));
	user.save();
}

function updateTheme(msg) {
	var users = CURRENT_DB.getView("users");
	var userDocs = users.getAllDocumentsByKey(msg.getFrom());
	var user = userDocs.getFirstDocument();
	user.replaceItemValue("Form", "user");
	user.replaceItemValue("theme", msg.getText());
	user.save();
}

function onMessage(msg){
	var application = msg.getData().get("application");
	
	if (application != "raven") {
			print("Message does not come from raven " + application);
			return false;
	}
	
	var msgType = msg.getData().get("type");
	if (msgType == "chat") { 
		saveChat(msg);
	}
	if (msgType == "feedback") { 
		saveFeedback(msg);
	}
	if (msgType == "user") { 
		updateUser(msg);
	}
	if (msgType == "theme") { 
		updateTheme(msg);
	}
	if (msgType == "badabing") { 
	  var msg = websocketClient.createMessage();
		print('before');
		var targets = new java.util.ArrayList();
		targets.add("/raven.nsf*");
		targets.add("/ravenListener");
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
}