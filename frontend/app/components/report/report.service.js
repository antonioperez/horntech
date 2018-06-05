angular.module('app')
    .service('chatservice',['$q', function ($q) {

        var self = this;
        //default to chat. Maybe cookie on reload
        self.defaultChatName = 'public';
        self.activeChatKey = '';

        self.activeChat = {};
        self.auth = firebase.auth();
        self.storageRef = firebase.storage().ref();
        self.database = firebase.database();

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                self.currentUser = user;
            }
        });

        self.getActiveChat = function () {
            return self.activeChat;
        }

        self.setActiveChat = function (value) {
            self.activeChat = value;
        }

        self.getChatRoom = function (chatRoom) {
            if (!chatRoom){
                chatRoom = self.defaultChatName;
            }
            
            var defer = $q.defer()
            var roomsRef = self.database.ref('rooms');
            var rooms = roomsRef.orderByChild('name').equalTo(chatRoom).on("value", function (snapshot) {
                snapshot.forEach(function (data) {
                    self.activeChat = data.val();
                    self.activeChatKey = data.key;
                    self.activeChat = data.val();
                    self.activeChat.key = data.key;
                    defer.resolve(self.activeChat);
                });
            }, function (errorObject) {
                defer.resolve(errorObject);
                console.log("The read failed: " + errorObject.code);
            });
            return defer.promise
        }
     }]);