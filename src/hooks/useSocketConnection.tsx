import {
  useEffect,
  useRef,
  createContext,
  useState,
  useCallback,
  useMemo,
  FC,
} from "react";
import io, { Socket } from "socket.io-client";
type SocketConnectionOptions = {
  isActive: boolean;
  startSocket: () => void;
  stopSocket: () => void;
  subscribeGates: (callbacks: { onOpen: any; onClose: any }) => void;
  subscribe: (eventName: string, callback: any) => any;
  subscribeListeners: (props: Record<string, any>) => void;
};
export const useSocketConnection = (
  props: [boolean, (val: boolean) => void]
) => {
  const [isActive, setOpened] = props;
  const stopSocket = useCallback(() => setOpened(false), [setOpened]);
  const startSocket = useCallback(() => setOpened(true), [setOpened]);
  const socketRef = useRef<Socket | null>(null);
  const subscribersRef = useRef<{ [key: string]: any }>({});
  const gatewaySubscribersRef = useRef<{ onOpen?: any; onClose?: any }>({});
  const { onOpen, onClose } = gatewaySubscribersRef.current;
  useEffect(() => {
    if (isActive) {
      socketRef.current = io("http://localhost:5000");
      Object.keys(subscribersRef.current).forEach((event) =>
        socketRef.current?.on(event, subscribersRef.current[event])
      );
      if (onOpen) {
        onOpen(socketRef.current);
      }
    } else {
      if (!!socketRef.current) {
        socketRef.current.disconnect();
        if (onClose) {
          onClose();
        }
      }
    }
    return () => {
      socketRef.current?.disconnect();
    };
  }, [isActive, onOpen, onClose]);
  return useMemo(
    () => ({
      isActive,
      startSocket,
      stopSocket,
      subscribeGates: (callbacks: { onOpen: any; onClose: any }) => {
        gatewaySubscribersRef.current = callbacks;
      },
      subscribe: (eventName: string, callback: any) =>
        (subscribersRef.current[eventName] = callback),
      subscribeListeners: (listeners: Record<string, any>) => {
        Object.keys(listeners).forEach(
          (key) => (subscribersRef.current[key] = listeners[key])
        );
      },
    }),
    [isActive, startSocket, stopSocket]
  );
};
export const SocketConnectionContext = createContext<SocketConnectionOptions>({
  isActive: false,
  startSocket: () => {},
  stopSocket: () => {},
  subscribe: () => {},
  subscribeGates: () => {},
  subscribeListeners: () => {},
});
export const SocketConnectionProvider: FC = ({ children }) => {
  const socketConnectionState = useState(false);
  const contextParams = useSocketConnection(socketConnectionState);
  return (
    <SocketConnectionContext.Provider value={contextParams}>
      {children}
    </SocketConnectionContext.Provider>
  );
};
