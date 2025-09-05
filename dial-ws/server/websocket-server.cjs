const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

// Store connected clients and messages
const clients = new Map();
const messages = [];

console.log(`WebSocket server running on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
  const clientId = uuidv4();
  clients.set(clientId, ws);
  
  console.log(`Client ${clientId} connected`);
  
  // Send existing messages to new client
  ws.send(JSON.stringify({
    type: 'message_history',
    messages: messages
  }));
  
  // Send current user count
  broadcast({
    type: 'user_count',
    count: clients.size
  });

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      
      switch (message.type) {
        case 'send_message':
          const newMessage = {
            id: uuidv4(),
            text: message.text,
            sender: message.sender || 'Anonymous',
            timestamp: new Date().toISOString(),
            component: message.component || 'unknown'
          };
          
          messages.push(newMessage);
          
          // Keep only last 100 messages
          if (messages.length > 100) {
            messages.shift();
          }
          
          // Broadcast to all clients
          broadcast({
            type: 'new_message',
            message: newMessage
          });
          break;
          
        case 'typing':
          // Broadcast typing indicator to other clients
          broadcastToOthers(clientId, {
            type: 'user_typing',
            sender: message.sender,
            isTyping: message.isTyping
          });
          break;
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    clients.delete(clientId);
    console.log(`Client ${clientId} disconnected`);
    
    // Update user count
    broadcast({
      type: 'user_count',
      count: clients.size
    });
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

function broadcast(message) {
  const messageString = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageString);
    }
  });
}

function broadcastToOthers(excludeClientId, message) {
  const messageString = JSON.stringify(message);
  clients.forEach((client, clientId) => {
    if (clientId !== excludeClientId && client.readyState === WebSocket.OPEN) {
      client.send(messageString);
    }
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down WebSocket server...');
  wss.close(() => {
    process.exit(0);
  });
});