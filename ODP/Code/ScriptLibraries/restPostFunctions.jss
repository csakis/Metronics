//this function handles all incoming post requests
function onPost (payload) {
	print('received payload');
	var msgType = payload.data.type;
	
	if (msgType == "chat") {
		saveChatMsg (payload);
		return "chat saved!"		
	}

	if (msgType == "feedback") {
		saveFeedbackMsg (payload);
		return "feedback saved!"		
	}
	return "message printed"
}

function saveChatMsg(msg) {
	var data = msg.data;
	print('got data');
	var doc = database.createDocument();
	print('created doc');
	doc.appendItemValue("Form", "chat");
	print("event: " + data.event);
	print("tab: " + data.chatTab);
	print("sender: " + msg.from);
	print("date: " + data.date);
	print("text: " + msg.text);
	doc.appendItemValue("eventId", data.event);
	doc.appendItemValue("chatTab", data.chatTab);
	doc.appendItemValue("sender", msg.from);
	doc.appendItemValue("date", data.date);
	doc.appendItemValue("message", msg.text);
	doc.save();
}

function saveFeedbackMsg(msg) {
	var data = msg.data;
	var feedback = data.feedback;
	print('got feedback data');
	var doc = database.createDocument();
	print('created feedback');
	doc.appendItemValue("Form", "feedback");
	doc.appendItemValue("feedbackBrowser", feedback.browser);
	doc.appendItemValue("feedbackContent", feedback.message);
	doc.appendItemValue("feedbackResolution", feedback.resolution);
	doc.appendItemValue("feedbackType", feedback.type);
	doc.appendItemValue("feedbackUser", msg.from);
	doc.appendItemValue("feedbackDate", data.date);
	doc.save();
	
}

function hello() {
  print("called form interval");
  
}