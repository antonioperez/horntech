(function () {

  angular
    .module('app')
    .controller('ChatCtrl', [
      '$http',
      '$rootScope', '$timeout', 'chatservice',
      Ctrl
    ]);

    function Ctrl ($http, $rootScope, $timeout, chatservice) {
      var self = this;
      var auth = chatservice.auth;
      var storageRef = chatservice.storageRef;
      var database = chatservice.database;
      
      self.currentUser = database.currentUser;
      self.messages = {};

      $timeout(function(){
        chatservice.getChatRoom().then(function(result) {
          self.loadMessages();         
        });
      },0);
      
      var setMessage = function(data) {
        $timeout(function(){
          var val = data.val();
          var key = data.key;
          self.messages[key] = val;
        },0);
      }

      self.loadMessages = function() {
        // Reference to the /messages/ database path.
        var loadLimit = 12;
        this.messagesRef = database.ref('rooms/'+$rootScope.activeChatKey+'/messages');
        this.messagesRef.off();
        // Loads the last x messages and listen for new/edited ones.
        this.messagesRef.limitToLast(loadLimit).on('child_added', setMessage);
        this.messagesRef.limitToLast(loadLimit).on('child_changed', setMessage);
        this.messagesRef.limitToLast(loadLimit).on('child_removed', setMessage);
        
      }

      $rootScope.$watch('activeChatKey', function () {
        self.messages = {};
        self.loadMessages();    
      })
    }

})();