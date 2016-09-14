/*
    Don't worry if you don't know Vue.js! You don't need a full understanding to do this tutorial.
    
    You only need to focus on Firebase.
*/

var Vue = window.Vue;

var store = {
    chatMessages: [],
    user: 'User',
    isLoading: false,
    state: 'normal', // state: normal, edit
    chatSelected: null
};

store.user = prompt('Username:');

Vue.filter('reverse', function(value) {
    return value.slice().reverse();
});

// Here we declare all components that will be used in our app.

var Navbar = Vue.extend({
    template: '#navbar',
    props: [
        'selectionMode',
        'deleteChat',
        'startEdit',
        'state'
    ]
});

var ChatItem = Vue.extend({
    template: '#chat-item',
    props: [
        'id',
        'isSelf',
        'isEdited',
        'sender',
        'clickChat',
        'isBeingEdited'
    ]
});

var ChatContainer = Vue.extend({
    template: '#chat-container',
    props: [
        'chatMessages',
        'clickChat',
        'chatSelected',
        'user'
    ],
    components: {
        'chat-item': ChatItem
    }
});

var InputContainer = Vue.extend({
    template: '#input-container',
    props: [
        'addChat',
        'clearSelection'
    ]
});

var LoadingScreen = Vue.extend({
    template: '#loading-screen'
});

// Our main application root, most of our logic resides here

var App = new Vue({
    el: '#app',
    data: store,
    components: {
        'navbar': Navbar,
        'chat-container': ChatContainer,
        'input-container': InputContainer,
        'loading-screen': LoadingScreen
    },
    methods: {
        addChat: function(sender, message) {
            this.chatMessages.push({
                id: Math.random(),
                sender: sender,
                message: message,
                isEdited: false
            });
        },
        deleteChat: function(id) {
            this.chatMessages = this.chatMessages.filter(function(message) {
                return message.id !== id;
            });
        },
        startEdit: function() {
            var self = this;
                        
            var chatMessage = this.chatMessages.filter(function(item) {
                return item.id === self.chatSelected;
            })[0];
            
            document.querySelector('#chat-box').value = chatMessage.message;
            this.inputFocus();
            
            self.state = 'edit';
        },
        editChat: function(id, message) {
            this.chatMessages = this.chatMessages.map(function(item) {
                if(item.id === id) {
                    return Object.assign({}, item, {
                        message: message,
                        isEdited: true
                    });
                }
                else {
                    return item;
                }
            });
        },
        clearSelection: function() {
            this.chatSelected = null;
        },
        handleAddChat: function() {
            var message = document.querySelector('#chat-box').value;
            
            if(!message) return; 
            
            document.querySelector('#chat-box').value = '';
            
            if(this.state === 'edit') {
                this.editChat(this.chatSelected, message);
                this.state = 'normal';
                this.chatSelected = null;
            }
            else {
                this.addChat(this.user, message);
            }
        },
        handleClickChat: function(id) {
            var chatItem = this.chatMessages.filter(function(item) {
                return item.id === id;
            })[0];
            
            if(chatItem.sender === this.user && this.state !== 'edit') {
                this.chatSelected = chatItem.id;
            }
        },
        handleDeleteChat: function(id) {
            this.deleteChat(id);
            this.clearSelection();
        },
        handleClearSelection: function() {
            if(this.state !== 'edit') {
                this.clearSelection();
            }
        },
        inputFocus: function() {
            if(!this.isLoading) {
                document.querySelector('#chat-box').focus()
            }
        }
    },
    created: function() {
        // Put your logic here on application load.
        
        // NOTE: DOM is not yet rendered at this stage!
    },
    ready: function() {
        // DOM is now loaded.
        
        this.inputFocus();
    }
});
