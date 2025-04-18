import { useState } from 'react';
import WebSocketClient from '@/lib/websocket';

export type WebSocketOptions = {
  onMessage?: (data: MessageEvent) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (e: Event) => void;
  retryInterval?: number;
  maxRetries?: number;
};

export function useWebSocket(url: string, options?: WebSocketOptions) {
  const [isConnected, setConnected] = useState(false);
  const wsClient = WebSocketClient.getInstance();

  const connect = () => {
    if (wsClient.getStatus()) return; // 避免重复连接

    const wsOptions: WebSocketOptions = {
      ...options,
      onOpen: () => {
        setConnected(true);
        options?.onOpen?.();
      },
      onClose: () => {
        setConnected(false);
        options?.onClose?.();
      },
      onMessage: options?.onMessage, // 确保onMessage回调被正确传递
    };

    wsClient.connect(url, wsOptions);
  };

  const disconnect = () => {
    wsClient.disconnect();
    setConnected(false);
  };

  const sendMessage = (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    return wsClient.send(data);
  };

  return {
    connect,
    disconnect,
    sendMessage,
    isConnected,
  };
}

export default useWebSocket;
