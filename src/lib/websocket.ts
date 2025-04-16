type WebSocketOptions = {
  onOpen?: () => void;
  onMessage?: (data: MessageEvent) => void;
  onClose?: () => void;
  onError?: (e: Event) => void;
  retryInterval?: number;
  maxRetries?: number;
};

class WebSocketClient {
  private static instance: WebSocketClient | null = null;
  private ws: WebSocket | null = null;
  private url: string = '';
  private options: WebSocketOptions = {};
  private retryCount: number = 0;
  private retryTimeout: number | null = null;

  private constructor() {}

  public static getInstance(): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient();
    }
    return WebSocketClient.instance;
  }

  public connect(url: string, options: WebSocketOptions = {}): void {
    this.url = url;
    this.options = {
      retryInterval: 5000,
      maxRetries: 5,
      ...options,
    };
    this.retryCount = 0;

    this.createConnection();
  }

  private createConnection(): void {
    if (this.ws) {
      this.ws.close();
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.retryCount = 0;
        this.options.onOpen?.();
      };

      this.ws.onmessage = (e) => {
        console.log('Message received:', e.data);
        this.options.onMessage?.(e);
      };

      this.ws.onerror = (e) => {
        console.error('WebSocket error:', e);
        this.options.onError?.(e);
      };

      this.ws.onclose = () => {
        console.log('WebSocket closed');
        this.options.onClose?.();
        this.retryConnection();
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.retryConnection();
    }
  }

  private retryConnection(): void {
    if (this.retryCount < (this.options.maxRetries || 5)) {
      console.log(
        `Retrying connection (${this.retryCount + 1}/${this.options.maxRetries || 5})...`
      );
      this.retryCount++;

      if (this.retryTimeout) {
        clearTimeout(this.retryTimeout);
      }

      this.retryTimeout = window.setTimeout(() => {
        this.createConnection();
      }, this.options.retryInterval);
    } else {
      console.log('Max retries reached. Connection failed.');
    }
  }

  public send(data: string | ArrayBufferLike | Blob | ArrayBufferView): boolean {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
      return true;
    }
    return false;
  }

  public getStatus(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  public disconnect(): void {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default WebSocketClient;
