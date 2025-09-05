import React from 'react';
import { Wifi, WifiOff, Users } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  userCount: number;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected, userCount }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
      <div className="flex items-center space-x-2">
        {isConnected ? (
          <>
            <Wifi size={16} className="text-green-500" />
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">Connected</span>
          </>
        ) : (
          <>
            <WifiOff size={16} className="text-red-500" />
            <span className="text-sm text-red-600 dark:text-red-400 font-medium">Disconnected</span>
          </>
        )}
      </div>
      
      <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
        <Users size={16} />
        <span>{userCount} online</span>
      </div>
    </div>
  );
};

export default ConnectionStatus;