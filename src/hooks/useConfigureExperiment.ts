import { SocketConnectionContext } from "./useSocketConnection";
import { useContext } from "react";
import { Socket } from "socket.io-client";
type Props = {
  socketCallbacks: {
    onOpen: (socket: Socket) => void;
    onClose: () => void;
    listeners: Record<string, (props: any) => void>;
  };
};
export function useConfigureExperiment({
  socketCallbacks: { onOpen, onClose, listeners },
}: Props) {
  const socketConnection = useContext(SocketConnectionContext);
  socketConnection.subscribeGates({ onOpen, onClose });
  socketConnection.subscribeListeners(listeners);
}
