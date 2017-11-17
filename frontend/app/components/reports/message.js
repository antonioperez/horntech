(function () {

  angular
    .module('app')
    .controller('ChatMessageCtrl', [
      '$http',
      '$timeout',
      '$rootScope',
      'FileUploader',
      'chatservice',
      Ctrl
    ]);

  function Ctrl($http, $timeout, $rootScope, FileUploader, chatservice) {
    var self = this;

    self.uploader = new FileUploader();
    var auth = chatservice.auth;
    var storageRef = chatservice.storageRef;
    var database = chatservice.database;
    self.currentUser = chatservice.currentUser;

    self.saveMessage = function (message) {
      var currentUser = self.currentUser;
      var textfield = $('#summernote');
      messageInput = textfield.summernote('code');
      var plainText = $(messageInput).text();

      if (message) {
        messageInput = message;
        plainText = message;
      }
      
      // Check that the user entered a message and is signed in.
      if (messageInput && currentUser && plainText.length > 0) {
        // Add a new message entry to the Firebase Database.
        //UTC
        var milliseconds = Math.floor((new Date()).getTime() / 1000);
        this.messagesRef = database.ref('rooms/'+$rootScope.activeChatKey+'/messages');
        this.messagesRef.push({
          userid: currentUser.uid,
          name: currentUser.displayName,
          text: messageInput,
          time: milliseconds,
          photoUrl: currentUser.photoURL || '/components/layout/logo.png'

        }).then(function () {
          // Clear message text field and SEND button state.
          textfield.summernote("reset");
          // this.toggleButton();
        }).catch(function (error) {
          console.error('Error writing new message to Firebase Database', error);
        });
      }
    };

    function writeUserData(userId, filename, size, downloadUrl, lastModified) {
      //fancy hashing algorithm goes here for name
      var encodedData = window.btoa(filename);
      var newRef = database.ref('rooms/'+$rootScope.activeChatKey+'/uploads/' + userId).child(encodedData);
      newRef.set({
        name: filename,
        size: size,
        downloadUrl: downloadUrl,
        lastModified: lastModified
      });

      var mess = '<a target="_blank" href="'+downloadUrl+'" class="downloadLink" ><strong >'+filename+'</strong></a>';
      self.saveMessage(mess);
    }

    self.uploader.uploadItem = function (value) {

      //HAD TO OVERWRITE EXISTING UPLOAD ITEM FUNCTION. 
      //BECAUSE IT IS SENDING TO A LOCAL PORT/URL. NEED TO SEND TO FIREBASE INSTEAD

      //move to fancy hash
      var hash = (Math.random()*1e32).toString(36);
      var currentUser = self.currentUser;
      var vm = this;
      var file = value._file;
      
      storageRef.child($rootScope.activeChatKey+'/user/'+ currentUser.uid + '/' + hash).put(file).then(function (snapshot) {

        var downloadURL = snapshot.downloadURL;
        item.isSuccess = true;
        item.isCancel = false;
        item.isError = false;
        writeUserData(currentUser.uid, file.name, file.size, downloadURL, file.lastModified);
        vm.clearQueue();
        vm._render();

      }, function (error) {

        console.log(error);
      });


      var index = this.getIndexOfItem(value);
      var item = this.queue[index];
      var transport = this.isHTML5 ? '_xhrTransport' : '_iframeTransport';

      item._prepareToUploading();
      if (this.isUploading) return;

      this._onBeforeUploadItem(item);
      if (item.isCancel) return;

      item.isUploading = true;
      this.isUploading = true;
      this[transport](item);
      this.clearQueue();
      this._render();
    };
  }
})();