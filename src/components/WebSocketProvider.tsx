import React from 'react';

const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 不自动 connect
  return <>{children}</>;
};

export default WebSocketProvider;
