import { useEffect, useState } from 'react';
import WebSocketClient from '../lib/websocket';

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

  useEffect(() => {
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
    };

    wsClient.connect(url, wsOptions);

    return () => {
      wsClient.disconnect();
    };
  }, [url]);

  const sendMessage = (data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    return wsClient.send(data);
  };

  return {
    sendMessage,
    isConnected,
  };
}

export default useWebSocket;
