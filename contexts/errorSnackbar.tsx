import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Snackbar } from "react-native-paper";
import { ERROR_COLOUR } from "../types";

interface ErrorSnackbarContextType {
  pushError: (message: string) => void;
}

const ErrorSnackbarContext = createContext<ErrorSnackbarContextType>({
  pushError: () => {},
});

export function useErrorSnackbar() {
  return useContext(ErrorSnackbarContext);
}

export function ErrorSnackbarProvider({ children }: PropsWithChildren) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);

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

  const pushError = (message: string) => {
    messageQueue.push(message);
    setMessageQueue(Array.from(messageQueue));
  };

  return (
    <ErrorSnackbarContext.Provider value={{ pushError }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={hideSnackbar}
        onIconPress={hideSnackbar}
        duration={3000}
        style={{ backgroundColor: ERROR_COLOUR }}
      >
        {message}
      </Snackbar>
    </ErrorSnackbarContext.Provider>
  );
}
