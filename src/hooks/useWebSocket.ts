import { useEffect, useRef, useCallback, useState } from 'react';

type Timeout = ReturnType<typeof setTimeout>;

interface BaseWebSocketMessage {
  type: string;
  data?: {
    size?: number;
    algorithm?: string;
    array?: number[];
    vertices?: number;
    edges?: [number, number, number][];
    start?: number;
    end?: number;
  };
}

interface UseWebSocketReturn {
  sendMessage: (message: BaseWebSocketMessage) => void;
  isConnected: boolean;
  error: Error | null;
}

export function useWebSocket<T extends BaseWebSocketMessage>(
  url: string,
  onMessage: (message: T) => void
): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 2000; // 2 seconds
  const isMounted = useRef(true);

  const connect = useCallback(() => {
    if (!isMounted.current) return;

    try {
      if (ws.current) {
        ws.current.close();
      }

      console.log(`Attempting to connect to WebSocket at ${url}...`);
      ws.current = new WebSocket(url);
      
      ws.current.onopen = () => {
        if (!isMounted.current) return;
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
        console.log('WebSocket connected successfully');
      };

      ws.current.onclose = (event) => {
        if (!isMounted.current) return;
        setIsConnected(false);
        console.log('WebSocket disconnected', event.code, event.reason);
        
        // Attempt to reconnect if not manually closed
        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectTimeout.current = setTimeout(() => {
            reconnectAttempts.current += 1;
            console.log(`Attempting to reconnect (${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS})...`);
            connect();
          }, RECONNECT_DELAY);
        } else {
          setError(new Error('Failed to connect to WebSocket server after multiple attempts'));
        }
      };

      ws.current.onerror = (event) => {
        if (!isMounted.current) return;
        const error = new Error('WebSocket connection error');
        setError(error);
        console.error('WebSocket error:', event);
      };

      ws.current.onmessage = (event) => {
        if (!isMounted.current) return;
        try {
          const message = JSON.parse(event.data) as T;
          onMessage(message);
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };
    } catch (e) {
      if (!isMounted.current) return;
      const error = new Error('Failed to create WebSocket connection');
      setError(error);
      console.error('WebSocket connection error:', e);
    }
  }, [url, onMessage]);

  useEffect(() => {
    isMounted.current = true;
    connect();

    return () => {
      isMounted.current = false;
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message: BaseWebSocketMessage) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      try {
        ws.current.send(JSON.stringify(message));
      } catch (e) {
        console.error('Error sending WebSocket message:', e);
        setError(new Error('Failed to send message'));
      }
    } else {
      console.error('WebSocket is not connected');
      setError(new Error('WebSocket is not connected'));
    }
  }, []);

  return {
    sendMessage,
    isConnected,
    error
  };
} 