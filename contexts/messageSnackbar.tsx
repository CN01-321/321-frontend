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

const MessageSnackbarContext = createContext<MessageSnackbarContextType>({
  pushMessage: () => {},
  pushError: () => {},
});

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

  useEffect(() => {
    if (!visible && messageQueue.length > 0) {
      popMessage();
      showSnackbar();
    }
  }, [visible, messageQueue]);

  const popMessage = () => {
    setMessage(messageQueue.shift() ?? null);
    setMessageQueue(Array.from(messageQueue));
  };

  const showSnackbar = () => setVisible(true);
  const hideSnackbar = () => setVisible(false);

  const pushMessage = (message: string) => {
    messageQueue.push({ message, type: "message" });
    setMessageQueue(Array.from(messageQueue));
  };

  const pushError = (message: string) => {
    messageQueue.push({ message, type: "error" });
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
        }}
      >
        {message?.message}
      </Snackbar>
    </MessageSnackbarContext.Provider>
  );
}
