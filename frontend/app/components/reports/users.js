(function () {
    
      angular
        .module('app')
        .controller('ChatUsersCtrl', [
          '$http',
          '$scope', '$timeout', 'chatservice',
          Ctrl
        ]);
    
        function Ctrl ($http, $scope, $timeout, chatservice) {
          var self = this;
          var auth = chatservice.auth;
          var storageRef = chatservice.storageRef;
          var database = chatservice.database;

          self.currentUser = chatservice.currentUser;
          self.activeRoom = chatservice.getActiveChat();
          self.messages = {};
          self.users = {};
              
          var setUsers = function(data) {
            $timeout(function(){
              var val = data.val();
              var key = data.key;
              self.users[key] = val;
            },0);
          }
    
          self.loadUsers = function() {
            // Reference to the /messages/ database path.
            var loadLimit = 25;
            this.messagesRef = database.ref('user');
            this.messagesRef.off();
            // Loads the last x messages and listen for new/edited ones.
            this.messagesRef.limitToLast(loadLimit).on('child_added', setUsers);
            this.messagesRef.limitToLast(loadLimit).on('child_changed', setUsers);
            this.messagesRef.limitToLast(loadLimit).on('child_removed', setUsers);
          }
        
          self.loadUsers();
    
        }
    
    })();