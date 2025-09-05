import { useEffect, useRef, useState, useCallback } from 'react';

export interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  component: string;
}

interface UseWebSocketReturn {
  messages: Message[];
  sendMessage: (text: string, sender: string, component: string) => void;
  isConnected: boolean;
  userCount: number;
  typingUsers: string[];
  sendTyping: (sender: string, isTyping: boolean) => void;
}

export const useWebSocket = (url: string): UseWebSocketReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const ws = useRef<WebSocket>({} as WebSocket);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    try {
      // Dynamically construct WebSocket URL for webcontainer environment
      const hostname = window.location.hostname;
      let wsUrl: string;
      
      if (hostname.includes('webcontainer-api.io')) {
        // In webcontainer, replace the port in the hostname
        const newHostname = hostname.replace(/--\d+--/, '--8080--');
        wsUrl = `ws://${newHostname}/`;
      } else {
        // Standard localhost or custom domain
        wsUrl = url;
      }
      
      ws.current = new WebSocket(wsUrl);
      
      ws.current.onopen = () => {
        console.log('Connected to WebSocket server');
        setIsConnected(true);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
      };
      
      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'message_history':
              setMessages(data.messages);
              break;
            case 'new_message':
              setMessages(prev => [...prev, data.message]);
              break;
            case 'user_count':
              setUserCount(data.count);
              break;
            case 'user_typing':
              setTypingUsers(prev => {
                if (data.isTyping) {
                  return prev.includes(data.sender) ? prev : [...prev, data.sender];
                } else {
                  return prev.filter(user => user !== data.sender);
                }
              });
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.current.onclose = () => {
        console.log('Disconnected from WebSocket server');
        setIsConnected(false);
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 3000);
      };
      
      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }
  }, [url]);

  useEffect(() => {
    connect();
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((text: string, sender: string, component: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'send_message',
        text,
        sender,
        component
      }));
    }
  }, []);

  const sendTyping = useCallback((sender: string, isTyping: boolean) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'typing',
        sender,
        isTyping
      }));
    }
  }, []);

  return {
    messages,
    sendMessage,
    isConnected,
    userCount,
    typingUsers,
    sendTyping
  };
};