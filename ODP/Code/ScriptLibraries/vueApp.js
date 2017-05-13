var vueRaven;
$( function() {

  // animation transitions
  // Vue.transition('panel', {
  // enterClass: 'slideInDown',
  // leaveClass: 'slideOutUp'
  // });

  vueRaven = new Vue(
      {
        el : '.vueApp',
        /***********************************************************************
         * DATA *
         **********************************************************************/
        data : {
          websocket : true,
          // chat properties
          activeTab : "chat1",
          firstName : "",
          chatWindow : "chat1",
          chats : [],
          chat : {
            message : null,
            chatTab : "",
            event : "",
            data : {
              chatTab : ""
            }
          },

          // navbar properties
          rfiStatus : {
            type : Number
          },
          fileStatus : {
            type : Number
          },
          dropDownOpen : false,
          themeOpen : false,
          preferedTheme : "default",
          themes : {
            "default" : "bs3/css/bootstrap.min.css",
            "yeti" : "bs3/css/yeti.min.css",
            "cyborg" : "bs3/css/cyborg.min.css",
            "superhero" : "bs3/css/superhero.min.css",
            "darkly" : "bs3/css/darkly.min.css",
            "paper" : "bs3/css/paper.min.css",
            "slate" : "bs3/css/slate.min.css",
            "spacelab" : "bs3/css/spacelab.min.css"
          },
          feedback : {
            type : "",
            message : "",
            browser : "",
            resolution : ""
          },
          user : {
            userName : ss_UserName,
            firstName : "",
            lastName : "",
            email : "",
            classifiedEmail : "",
            organization : "",
            position : "",
            cellPhone : "",
            securePhone : "",
            theme : ""
          },
          // panel properties
          isChatsOpen : true,
          isUserOpen : true,
          isChatsShown : true,
          isUserShown : true

        },
        /***********************************************************************
         * COMPUTED *
         **********************************************************************/
        computed : {
          // chat properties

          // navbar properties:
          rfiClass : function() {
            switch (this.rfiStatus) {
            case 0:
              return "mdi-bell";
            case 1:
              return "mdi-bell-ring-outline orange ";
            case 2:
              return "mdi-bell-ring red";
            case 3:
              return "mdi-bell-plus green";

            }
          },
          fileClass : function() {
            switch (this.fileStatus) {
            case 0:
              return "mdi-file";
            case 1:
              return "mdi-file-check aqua ";
            case 2:
              return "mdi-file-multiple blue";
            case 3:
              return "mdi-file-image aqua";
            }
          }
        },
        /***********************************************************************
         * METHODS *
         **********************************************************************/
        methods : {
          // this method is needed to close open navbar items
          resetVueApp : function() {
            this.dropDownOpen = false;
            this.themeOpen = false;
          },

          // chat methods
          createMultipleMessages : function() {
            var text = "First of all, it’s true that Trump has repeatedly said he wants America to be united. As we’ve pointed out,though, that insistence has almost uniformly been expressed as a desire for Trump’s opponents to embrace his presidency. Trump made very little effort to reach out to his political opponents after he won the election, criticizing protesters as being paid and Hillary Clinton voters as being fraudulent. He never moderated his positions from the primary to the general election and then to his administration — certainly his right, but a move that helped assure that his opponents would stay opposed to his presidency. That Spicer thinks the Anne Frank Center should “praise the president for his leadership in this area” is simply baffling.Second, it’s a stretch to say that Trump has “brought a diverse group of folks into his administration.” Trump’s Cabinet was more white and more male than any since that of Ronald Reagan — until his first pick for labor secretary dropped out and was replaced with a man who is Hispanic. Spicer qualifies this questionable claim with “people that he has sought the advice of,” which offers an infinite amount of wiggle room.Third, Trump’s commitment to voting rights is already highly questionable. Trump’s insistence that voter fraud is a rampant problem (which it isn’t) seems poised to precede a new effort to restrict voting access. Those efforts have consistently and demonstrably curtailed voting by nonwhite voters.But the most egregious claim Spicer made — a claim he made over the weekend, too — is that Trump has been “very forceful with his denunciations” and that “no matter how many times he talks about this that it’s never good enough.";
            var textArray = text.split(' ');
            var textArrayLength = textArray.length;
            for ( var i = 0; i < 10000; i++) {
              
              msg = {};
              msg.message = ""
              for(var j=0; j<10; j++) {
                msg.message += " " + textArray[Math.floor(Math.random()*textArrayLength)];
              }
              msg.event = vs_EventId;
              msg.data = {};
              msg.data.chatTab = "chat" + parseInt(Math.floor(Math.random()*3)+1);
              var thisMsg = createChatMsg(msg);
              ws.send(thisMsg);
            }
          },

          sendChat : function(e) {
            if (e.target.value === "")
              return;
            this.chat.message = e.target.value;
            this.chat.event = vs_EventId;
            this.chat.data.chatTab = this.chat.chatTab;
            var thisMsg = createChatMsg(this.chat);
            ws.send(thisMsg);
            e.target.value = "";
          },
          saveChat : function(msg) {
            this.chatWindow = msg.data.chatTab;
            this.chats.push(msg);
          },
          shortUserName : function(name) {
            return middle(name, "=", "/");
          },
          convertDate : function(d) {
            var date = new Date(parseInt(d));
            return date.toLocaleTimeString("en-US") + "-"
                + date.toLocaleDateString("en-US");
          },
          // navbar methods
          loadTheme : function(theme) {
            var path = this.themes[theme];
            var themeLink = $('<link id="myTheme" href=" ' + path + '" rel="stylesheet" />');
            themeLink.appendTo('head');
          },
          changeTheme : function(theme) {
            var path = this.themes[theme];
            $('link[id="myTheme"]').attr('href', path);
            this.themeOpen = false; // collapse theme menu
            this.dropDownOpen = false; // collapse dropdown
            this.preferedTheme = theme;
            this.user.theme = theme;
            var updateThemeMsg = createUpdateThemeMsg(theme);
            ws.send(updateThemeMsg);
          },
          changeTheme : function(theme) {
            var path = this.themes[theme];
            $('link[id="myTheme"]').attr('href', path);
            this.themeOpen = false; // collapse theme menu
            this.dropDownOpen = false; // collapse dropdown
            this.preferedTheme = theme;
            this.user.theme = theme;
            var updateThemeMsg = createUpdateThemeMsg(theme);
            ws.send(updateThemeMsg);
          },
          resetFeedbackForm : function() {
            this.feedback.type = "general";
            this.feedback.message = "";
          },
          sendFeedback : function() {
            this.feedback.browser = this.checkBrowser();
            this.feedback.resolution = window.screen.availWidth + "x"
                + window.screen.availHeight;
            var feedbackMsg = createFeedbackMsg(this.feedback);
            ws.send(feedbackMsg);
          },
          updateUser : function() {
            var userMsg = createUserMsg(this.user);
            ws.send(userMsg);
          },
          checkBrowser : function() {
            if (typeof InstallTrigger !== 'undefined')
              return "Firefox";
            if (/* @cc_on!@ */false || !!document.documentMode)
              return "Internet Explorer";
            if (!!window.chrome && !!window.chrome.webstore)
              return "Chrome";
            if ((!!window.opr && !!opr.addons) || !!window.opera
                || navigator.userAgent.indexOf(' OPR/') >= 0)
              return "Opera";
            if (Object.prototype.toString.call(window.HTMLElement).indexOf(
                'Constructor') > 0)
              return "Safari";
          }
        // panel methods

        },
        /***********************************************************************
         * LIFECYCLE HOOKS *
         **********************************************************************/
        beforeCreate : function() {

        },
        created : function() {

          var self = this;
          // populate the chat tabs
          $.getJSON('event.xsp/chats').then( function(response) {
            var arrayLength = response.length;
            for ( var i = 1; i < arrayLength; i++) {
              var msg = {};
              msg.data = {};
              msg.text = response[i].message;
              msg.sender = response[i].sender;
              msg.data.chatTab = response[i].chatTab;
              msg.data.date = response[i].date;
              self.chats.push(msg);
            }
          });
          // get user info
          $
              .getJSON('event.xsp/getUser')
              .then( function(response) {
                var arrayLength = response.length;
                if (arrayLength === 0) {
                  // we have a new user, make them fill the userProfile form out
                  $('#userProfileFormDiv').modal();
                  return;
                }
                if (arrayLength > 1) {
                  // we have a problem with user registration, users should be
                  // unique
                  console
                      .error("****There are non-unique users in the database. Check your users view!!***");
                  return;
                }
                // populate the user with the response
                var user = response[0];
                self.user.firstName = user.firstName;
                self.user.lastName = user.lastName;
                self.user.email = user.email;
                self.user.classifiedEmail = user.classifiedEmail;
                self.user.phone = user.phone;
                self.user.cellPhone = user.cellPhone;
                self.user.securePhone = user.securePhone;
                self.user.phone = user.phone;
                self.user.organization = user.organization;
                self.user.position = user.position;
                self.user.theme = user.theme;
                self.preferedTheme = user.theme;
                self.loadTheme(user.theme); // load the default theme on load
              });

        },
        mounted : function() {
          document.getElementById(chatInputBox).focus();
          this.rfiStatus = 0; // reset the rfi bell in the navbar
          this.fileStatus = 0; // reset the file icon in the navbar
          this.$off('click', 'doNotListen');

        },
        updated : function() {
          var el = document
              .querySelector('div[data-chattab="' + this.chatWindow + '"]');
          el.scrollTop = el.scrollHeight;

        }
      });
});