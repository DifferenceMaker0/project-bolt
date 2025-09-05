import React, { useState } from 'react';
import { MessageCircle, MessageSquare, Bell, Headphones } from 'lucide-react';
import Dialog from './components/Dialog';
import Button from './components/Button';
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';
import ConnectionStatus from './components/ConnectionStatus';
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<'chat' | 'support' | 'notifications'>('chat');
  
  const { 
    messages, 
    sendMessage, 
    isConnected, 
    userCount, 
    typingUsers, 
    sendTyping 
  } = useWebSocket('ws://localhost:8080');

  const openDialog = (type: 'chat' | 'support' | 'notifications') => {
    setDialogContent(type);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const renderDialogContent = () => {
    switch (dialogContent) {
      case 'chat':
        return (
          <>
            <ConnectionStatus isConnected={isConnected} userCount={userCount} />
            <MessageList 
              messages={messages} 
              typingUsers={typingUsers}
              currentComponent="chat"
            />
            <div className="mt-4">
              <MessageInput
                onSendMessage={sendMessage}
                onTyping={sendTyping}
                component="chat"
                placeholder="Send a message to the chat..."
              />
            </div>
          </>
        );
      case 'support':
        return (
          <>
            <ConnectionStatus isConnected={isConnected} userCount={userCount} />
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-green-700">
                <strong>Support Channel:</strong> Get help from our team or community members.
              </p>
            </div>
            <MessageList 
              messages={messages.filter(msg => msg.component === 'support')} 
              typingUsers={typingUsers}
              currentComponent="support"
            />
            <div className="mt-4">
              <MessageInput
                onSendMessage={sendMessage}
                onTyping={sendTyping}
                component="support"
                placeholder="Ask for help or support..."
              />
            </div>
          </>
        );
      case 'notifications':
        return (
          <>
            <ConnectionStatus isConnected={isConnected} userCount={userCount} />
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-purple-700">
                <strong>Notifications Channel:</strong> System updates and announcements.
              </p>
            </div>
            <MessageList 
              messages={messages.filter(msg => msg.component === 'notification')} 
              typingUsers={typingUsers}
              currentComponent="notification"
            />
            <div className="mt-4">
              <MessageInput
                onSendMessage={sendMessage}
                onTyping={sendTyping}
                component="notification"
                placeholder="Send a notification..."
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Real-time Messaging System</h1>
          
          <p className="text-gray-600 mb-8 text-center">
            Open different messaging channels to send and receive real-time messages. 
            Each channel operates independently with live updates.
          </p>
          
          <div className="space-y-4">
            <Button
              fullWidth
              onClick={() => openDialog('chat')}
              className="flex items-center justify-center"
            >
              <MessageSquare size={18} className="mr-2" />
              General Chat
            </Button>
            
            <Button
              variant="secondary"
              fullWidth
              onClick={() => openDialog('support')}
              className="flex items-center justify-center"
            >
              <Headphones size={18} className="mr-2" />
              Support Channel
            </Button>
            
            <Button
              variant="outline"
              fullWidth
              onClick={() => openDialog('notifications')}
              className="flex items-center justify-center"
            >
              <Bell size={18} className="mr-2" />
              Notifications
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              {isConnected ? (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              ) : (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              )}
              <span className="text-sm font-medium text-gray-700">
                {isConnected ? 'Connected' : 'Connecting...'}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              {userCount} user{userCount !== 1 ? 's' : ''} online
            </p>
          </div>
        </div>
      </div>
      
      <Dialog 
        isOpen={isDialogOpen} 
        onClose={closeDialog}
        maxWidth="max-w-2xl"
        title={
          dialogContent === 'chat' 
            ? 'General Chat' 
            : dialogContent === 'support' 
              ? 'Support Channel' 
              : 'Notifications'
        }
      >
        {renderDialogContent()}
      </Dialog>
    </div>
  );
}

export default App;