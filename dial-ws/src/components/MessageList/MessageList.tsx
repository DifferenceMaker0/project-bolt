import React, { useEffect, useRef } from 'react';
import { Clock, MessageSquare } from 'lucide-react';
import { Message } from '../../hooks/useWebSocket';

interface MessageListProps {
  messages: Message[];
  typingUsers: string[];
  currentComponent?: string;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  typingUsers, 
  currentComponent 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getComponentColor = (component: string) => {
    const colors = {
      'chat': 'bg-blue-100 text-blue-800',
      'support': 'bg-green-100 text-green-800',
      'notification': 'bg-purple-100 text-purple-800',
      'unknown': 'bg-gray-100 text-gray-800'
    };
    return colors[component as keyof typeof colors] || colors.unknown;
  };

  return (
    <div className="h-80 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <MessageSquare size={48} className="mb-2 opacity-50" />
          <p className="text-sm">No messages yet. Start a conversation!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md ${
                message.component === currentComponent 
                  ? 'bg-blue-50 border-l-4 border-blue-500' 
                  : 'bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {message.sender}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComponentColor(message.component)}`}>
                    {message.component}
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Clock size={12} className="mr-1" />
                  {formatTime(message.timestamp)}
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {message.text}
              </p>
            </div>
          ))}
          
          {typingUsers.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 italic">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span>
                {typingUsers.length === 1 
                  ? `${typingUsers[0]} is typing...`
                  : `${typingUsers.join(', ')} are typing...`
                }
              </span>
            </div>
          )}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;