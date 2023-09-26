// based off of https://expo.github.io/router/docs/guides/auth/
import { useRouter, useSegments } from "expo-router";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import JWT from "expo-jwt";
import * as SecureStore from "expo-secure-store";
import { JWT_SECRET } from "@env";
import axios from "axios";
import { UserType } from "../types/types";

interface TokenUser {
  _id: string;
  email: string;
  type: UserType;
}

export type AuthContextType = {
  logIn: (token: string) => void;
  logOut: () => void;
  getTokenUser: () => TokenUser | null;
  getBearerToken: () => string;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

// will ensure that the user is only in pages that they are allowed in
// by looking at what route they are in and redirecting if needed
function useProtectedRoute(user: TokenUser | null) {
  const segments = useSegments();
  const router = useRouter();

  console.log(segments);

  useEffect(() => {
    const inLoginPage = segments[0] === "(auth)";
    const inOwnerPage = segments[1] === "owner";
    const inCarerPage = segments[1] === "carer";

    // if user is not logged in and is in the auth pages then redirect
    // to the landing page
    if (!user && !inLoginPage) {
      console.log("no user and not in login - redirecting to landing");
      router.replace("/landing");
    }

    // if user is logged in and is trying to log it then redirect to the
    // home page
    if (user && inLoginPage) {
      router.replace("/home");
    }

    // if owner is in carer pages redirect them
    if (user?.type === "owner" && inCarerPage) {
      router.replace("/home");
    }

    // if owner is in carer pages redirect them
    if (user?.type === "carer" && inOwnerPage) {
      router.replace("/home");
    }
  }, [user, segments]);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<TokenUser | null>(null);

  // stores and sets the token
  const updateTokenUser = async (token: string) => {
    try {
      const decode = JWT.decode<TokenUser>(token, JWT_SECRET);
      // set the Authorization header to send in axios calls if decode is
      // successful
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await SecureStore.setItemAsync("token", token);

      // set user must be after axios and secure store so that protected route
      // does not redirect before they have been set correctly
      setUser(decode.user);
    } catch (e) {
      throw new Error(`unable to decode token: ${token}`);
    }
  };

  const deleteTokenUser = async () => {
    await SecureStore.deleteItemAsync("token");
    // remove the Authorization header from sending in axios http calls
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  // set the user whenever the token is reset or changed
  // and store/remove token from secure storage
  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      const token = await SecureStore.getItemAsync("token");

      // do not set token if no token is present
      if (!token) {
        return;
      }

      if (token && !ignore) {
        console.log("updating token in useEffect");
        try {
          await updateTokenUser(token);
        } catch (e) {
          console.error(e);
        }
      }
    })();

    return () => (ignore = true);
  }, []);

  useProtectedRoute(user);

  const logIn = async (token: string) => {
    try {
      console.log("updating token in logIn");
      await updateTokenUser(token);
    } catch (e) {
      console.error(e);
    }
  };

  const logOut = async () => {
    await deleteTokenUser();
  };

  const getTokenUser = () => user;

  const getBearerToken = () =>
    axios.defaults.headers.common["Authorization"]?.toString() ?? "";

  return (
    <AuthContext.Provider
      value={{ logIn, logOut, getTokenUser, getBearerToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}
