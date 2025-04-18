export type WebSocketOptions = {
  onOpen?: () => void;
  onMessage?: (data: MessageEvent) => void;
  onClose?: () => void;
  onError?: (e: Event) => void;
  onReconnect?: (attempt: number) => void;
  retryInterval?: number;
  maxRetries?: number;
};

class WebSocketClient {
  private static instance: WebSocketClient | null = null;
  private ws: WebSocket | null = null;
  private url = '';
  private options: WebSocketOptions = {};
  private retryCount = 0;
  private retryTimeout: number | null = null;
  private manualDisconnect = false;
  private isConnecting = false;
  private isFirstConnection = true; // 标记是否是首次连接

  private constructor() {
    // 防止刷新时重连
    window.addEventListener('beforeunload', () => {
      this.manualDisconnect = true;
      this.disconnect();
    });
  }

  public static getInstance(): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient();
    }
    return WebSocketClient.instance;
  }

  public connect(url: string, options: WebSocketOptions = {}): void {
    if (this.getStatus() || this.isConnecting) {
      console.log('[WS] 已连接或正在连接中，跳过 connect');
      return;
    }

    this.isConnecting = true;

    console.log('[WS] 开始连接 URL:', url);
    console.log('[WS] 是否首次连接:', this.isFirstConnection);
    console.log(
      '[WS] 连接选项:',
      JSON.stringify({
        hasOnOpen: !!options.onOpen,
        hasOnMessage: !!options.onMessage,
        hasOnClose: !!options.onClose,
        hasOnError: !!options.onError,
        retryInterval: options.retryInterval,
        maxRetries: options.maxRetries,
      })
    );

    this.url = url;
    this.options = {
      retryInterval: 5000,
      maxRetries: 5,
      ...options,
    };
    this.retryCount = 0;
    this.manualDisconnect = false;

    this.createConnection();
  }

  private createConnection(): void {
    if (this.ws) {
      this.ws.close();
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.retryCount = 0;
        this.isConnecting = false;
        this.options.onOpen?.(); // ✅ onOpen 正常

        if (this.isFirstConnection) {
          console.log('[WS] 首次连接完成，回调函数状态:', {
            hasOnMessage: !!this.options.onMessage,
          });
          this.isFirstConnection = false;
        }
      };

      this.ws.onmessage = (e) => {
        this.options.onMessage?.(e); // ✅ 使用每次 connect() 传进来的最新函数
      };

      this.ws.onerror = (e) => {
        console.error('[WS] ❌ Error:', e);
        this.isConnecting = false;
        this.options.onError?.(e);
      };

      this.ws.onclose = () => {
        console.warn('[WS] 🔌 Closed');
        this.isConnecting = false;
        this.options.onClose?.();
        this.retryConnection();
      };
    } catch (err) {
      console.error('[WS] ❌ Connection error:', err);
      this.isConnecting = false;
      this.retryConnection();
    }
  }

  private retryConnection(): void {
    if (this.manualDisconnect) {
      console.log('[WS] ⛔ 手动断开，不重连');
      return;
    }

    const maxRetries = this.options.maxRetries || 5;

    if (this.retryCount < maxRetries) {
      this.retryCount++;
      const interval = this.options.retryInterval || 5000;

      console.log(`[WS] 🔁 重连中 (${this.retryCount}/${maxRetries})...`);
      console.log('[WS] 重连时options状态:', {
        hasOnMessage: !!this.options.onMessage,
      });

      this.options.onReconnect?.(this.retryCount);

      if (this.retryTimeout) clearTimeout(this.retryTimeout);

      this.retryTimeout = window.setTimeout(() => {
        this.createConnection();
      }, interval);
    } else {
      console.log('[WS] ❌ 达到最大重连次数，放弃连接');
    }
  }

  public send(data: string | ArrayBufferLike | Blob | ArrayBufferView): boolean {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
      return true;
    }
    console.warn('[WS] 无法发送消息，连接未就绪');
    return false;
  }

  public getStatus(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  public disconnect(): void {
    this.manualDisconnect = true;

    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }

    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close();
      }
      this.ws = null;
    }

    console.log('[WS] 🚪 已手动断开连接');
  }
}

export default WebSocketClient;
