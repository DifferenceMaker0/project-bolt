import React, { useState, useRef, useEffect } from 'react';
import { Send, User } from 'lucide-react';
import Button from '../Button';

interface MessageInputProps {
  onSendMessage: (text: string, sender: string, component: string) => void;
  onTyping: (sender: string, isTyping: boolean) => void;
  component: string;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTyping,
  component,
  placeholder = "Type your message..."
}) => {
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleTyping = (value: string) => {
    setMessage(value);
    
    if (sender && value.length > 0 && !isTyping) {
      setIsTyping(true);
      onTyping(sender, true);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        onTyping(sender, false);
      }
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && sender.trim()) {
      onSendMessage(message.trim(), sender.trim(), component);
      setMessage('');
      
      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false);
        onTyping(sender, false);
      }
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="sender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Your Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            id="sender"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter your name"
            required
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Message
        </label>
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            id="message"
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder={placeholder}
            required
          />
          <Button
            type="submit"
            disabled={!message.trim() || !sender.trim()}
            className="px-3 py-2 flex items-center justify-center"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MessageInput;