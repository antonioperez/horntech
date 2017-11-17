(function () {
    
      angular
        .module('app')
        .controller('ChatRoomCtrl', [
          '$http',
          '$rootScope', '$timeout', 'chatservice',
          Ctrl
        ]);
    
        function Ctrl ($http, $rootScope, $timeout, chatservice) {
          var self = this;
          var auth = chatservice.auth;
          var storageRef = chatservice.storageRef;
          var database = chatservice.database;
          self.currentUser = chatservice.currentUser;
          self.activeRoom = {};
        
          $timeout(function(){
            chatservice.getChatRoom().then(function(result) {
              self.activeRoom = result;
              $rootScope.activeChatKey = result.key
              self.loadRooms();
            });
          },0);

          self.rooms = {};
          var setRooms = function(data) {
            $timeout(function(){
              var val = data.val();
              var key = data.key;
              self.rooms[key] = val;
              
            },0);
          }
    
          self.loadRooms = function() {
            // Reference to the /messages/ database path.
            var loadLimit = 12;
            this.roomsRef = database.ref('rooms');
            this.roomsRef.off();
            // Loads the last x messages and listen for new/edited ones.
            this.roomsRef.limitToLast(loadLimit).on('child_added', setRooms);
            this.roomsRef.limitToLast(loadLimit).on('child_changed', setRooms);
            this.roomsRef.limitToLast(loadLimit).on('child_removed', setRooms);
            
          }

          self.changeRooms = function(room) {
            chatservice.getChatRoom(room).then(function(result) {
              self.activeRoom = result;
              $rootScope.activeChatKey = result.key;              
            });
          }
        }
    })();