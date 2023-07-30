// based off of https://expo.github.io/router/docs/guides/auth/
import { useRouter, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import JWT from "expo-jwt";
import * as SecureStore from "expo-secure-store";
import { JWT_SECRET } from "@env";
import axios from "axios";
import { UserType } from "../types";

interface TokenUser {
  _id: string;
  email: string;
  type: UserType;
}

export type AuthContextType = {
  logIn: (token: string) => void;
  logOut: () => void;
  getTokenUser: () => TokenUser | null;
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

export function AuthProvider(props: any) {
  const [user, setUser] = useState<TokenUser | null>(null);
  const [token, setToken] = useState("");

  const storeToken = async () => {
    // if token user is verified, store the token in secure store
    try {
      await SecureStore.setItemAsync("token", token);
    } catch (e) {
      console.error(e);
      return;
    }

    // no need for try as this token has already been tested
    const decode = JWT.decode(token, JWT_SECRET);

    // set this token to be sent with every axios call
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const newUser: TokenUser = decode["user"] as TokenUser;
    setUser(newUser);
  };

  const deleteToken = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
    } catch (e) {
      console.error(e);
    }

    // remove the Authorization header from sending in axios http calls
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  // set the user whenever the token is reset or changed
  // and store/remove token from secure storage
  useEffect((): (() => void) => {
    console.log("token has changed", token);

    // prevent race conditions see "note on fetching data inside useeffect"
    // https://devtrium.com/posts/async-functions-useeffect
    let ignore = false;

    (async () => {
      if (token === "" && !ignore) {
        await deleteToken();
        return;
      }

      if (!ignore) {
        await storeToken();
      }
    })();

    return () => (ignore = true);
  }, [token]);

  // load the token when page/app loads, if there is one
  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      try {
        let token = await SecureStore.getItemAsync("token");
        if (token && !ignore) {
          // calling set token will trigger the other useeffect which
          // will update the user
          setToken(token);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => (ignore = true);
  }, []);

  const logIn = async (token: string) => {
    try {
      // verify the JWT is valid
      JWT.decode<TokenUser>(token, JWT_SECRET, { iss: "pet-carer.com" });
      setToken(token);
      console.log("token is valid and set token");
    } catch (e) {
      console.error(e);
    }
  };

  const logOut = async () => {
    setToken("");
  };

  const getUser = () => user;

  useProtectedRoute(user);

  return (
    <AuthContext.Provider value={{ logIn, logOut, getTokenUser: getUser }}>
      {props.children}
    </AuthContext.Provider>
  );
}
