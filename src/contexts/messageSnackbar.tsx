/**
 * @file Context for success and error message handling
 * @author George Bull
 */

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Snackbar, useTheme } from "react-native-paper";
import { ERROR_COLOUR } from "../types/types";

interface MessageSnackbarContextType {
  pushMessage: (message: string) => void;
  pushError: (message: string) => void;
}

const MessageSnackbarContext = createContext<MessageSnackbarContextType>(
  {} as MessageSnackbarContextType
);

export function useMessageSnackbar() {
  return useContext(MessageSnackbarContext);
}

interface Message {
  message: string;
  type: "message" | "error";
}

export function MessageSnackbarProvider({ children }: PropsWithChildren) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [messageQueue, setMessageQueue] = useState<Message[]>([]);
  const theme = useTheme();

  const showSnackbar = () => setVisible(true);
  const hideSnackbar = () => setVisible(false);

  // while there are messages in the message queue and the snackbar is not
  // visible, pop a message from the queue and show it to the user
  useEffect(() => {
    if (!visible && messageQueue.length > 0) {
      popMessage();
      showSnackbar();
    }
  }, [visible, messageQueue]);

  // add a message to the end of the queue
  const pushMessage = (message: string) => {
    messageQueue.push({ message, type: "message" });
    setMessageQueue(Array.from(messageQueue));
  };

  // add an error to the end of the queue
  const pushError = (message: string) => {
    messageQueue.push({ message, type: "error" });
    setMessageQueue(Array.from(messageQueue));
  };

  // remove the message from the start of the queue and set it as the current
  // message
  const popMessage = () => {
    setMessage(messageQueue.shift() ?? null);
    setMessageQueue(Array.from(messageQueue));
  };

  return (
    <MessageSnackbarContext.Provider value={{ pushMessage, pushError }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={hideSnackbar}
        onIconPress={hideSnackbar}
        duration={3000}
        style={{
          backgroundColor:
            message?.type === "message" ? theme.colors.primary : ERROR_COLOUR,
          marginBottom: 100,
        }}
      >
        {message?.message}
      </Snackbar>
    </MessageSnackbarContext.Provider>
  );
}
