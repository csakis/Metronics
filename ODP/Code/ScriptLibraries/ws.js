if (typeof Object.create !== 'function') {
	Object.create = function(o) {
		var F = function() {
		};
		F.prototype = o;
		return new F();
	}
}

function middle(str, startChar, endChar){
	var start = str.indexOf(startChar) + 1;
	var end = str.indexOf(endChar);
	return str.substring(start, end);
}

function createMsgHeader() {
	// create the constant part of websocket messages
	var msg = {};
	msg.from = ss_UserName; //a global var of @UserName()
	msg.targets = ["/raven.nsf*", "/ravenListener"];
	//msg.to= "/*";
	msg.data = {};
	msg.data.date = new Date().valueOf();
	msg.data.application = "raven";
	return msg
}

function createChatMsg(chat) {
	var msg = createMsgHeader();
	msg.text = chat.message;
	msg.data.type = "chat";
	msg.data.event = chat.event;
	msg.data.chatTab = chat.data.chatTab;
	return msg;
}
function createBadabing() {
  var msg = createMsgHeader();
  msg.text = "hello";
  msg.data.type = "badabing";
 
  return msg;
}
function createFeedbackMsg(feedback) {
	var msg = createMsgHeader();
	msg.targets = ["/ravenListener"];
	msg.text = "";
	msg.data.type = "feedback";
	msg.data.feedback = feedback;
	return msg;
}

function createUserMsg(user) {
	var msg = createMsgHeader();
	msg.targets = ["/ravenListener"];
	msg.text = "";
	msg.data.type = "user";
	user.theme = user.theme || "default";
	msg.data.user = user;
	return msg;
}

function createUpdateThemeMsg(theme) {
	var msg = createMsgHeader();
	msg.targets = ["/ravenListener"];
	msg.text = theme;
	msg.data.type = "theme";
	return msg;
}

function createShapeMsg(shape) {
	var msg = createMsgHeader();
	msg.text = ""; // there's no chat msg
	msg.data.type = "shape";
	msg.data.shape = shape;
	return msg;
}

var ws;

function initWs() {
	ws = Object.create(Ws);
	ws.init(wsUri);
}

var Ws = {
	self : null,
	websocket : null,

	init : function(uri) {
		self = this;
		websocket = new WebSocket(uri);
		websocket.onopen = this.onOpen;
		websocket.onclose = this.onClose;
		websocket.onmessage = this.onMessage;
		websocket.onerror = this.onError;
	},
/* *** EVENT HANDLERS *** */
	onOpen : function(e) {
		console.log("A websocket connection has been opened.");
		
	},
	onClose : function(e) {
		
	},
	onMessage : function(e) {
		var chatMessage = JSON.parse(e.data);
		// check if the message comes form raven
		if (chatMessage.data.application !== "raven") {
			console.log("This is not a raven message: "+ chatMessage.data.application);
			return false;
		} // if application
		
		var chatMessageType = chatMessage.data.type;

		// message type=shape
		if (chatMessageType === "shape") {
			var shape = chatMessage.data.shape;
			$shapeDiv.
			css("background-color", shape.bgColor).
			css("border-radius", shape.borderRadius).
			css("border", shape.border).
			width(shape.divWidth).
			height(shape.divHeight);

		} //end shape
		
		// message type=chat
		if (chatMessageType === "chat") {
			var vueChatMsg = {};
			vueChatMsg.data = {};
			vueChatMsg.sender = chatMessage.from;
			vueChatMsg.text = chatMessage.text;
			vueChatMsg.data.chatTab = chatMessage.data.chatTab;
			vueChatMsg.data.date = chatMessage.data.date;
			vueRaven.saveChat(vueChatMsg);

		} //end chat
	},
	onError : function(e) {
		
	},
/* *** METHODS *** */
	send : 	function(msg) {
		if (websocket.readyState == 1) {
			websocket.send(JSON.stringify(msg));
		}
		else {
		//send the websocket message by Ajax POST	
			$.ajax({
				type: "POST",
				url: "event.xsp/postData",
				data:JSON.stringify(msg),
				dataType: 'text', //this is for the response
				success: function (res) {
				log("Yay: " +res);
				},
				contentType: "application/json" //this is for the payload			
			});
		}
	},
	close:function(){
		websocket.close();
	}
};