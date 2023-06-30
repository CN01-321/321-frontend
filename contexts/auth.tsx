// based off of https://expo.github.io/router/docs/guides/auth/
import { useRouter, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import JWT from "expo-jwt";
import * as SecureStore from "expo-secure-store";
import { JWT_SECRET } from "@env";
import axios from "axios";

export type UserType = "owner" | "carer";

interface User {
  email: string;
  type: UserType;
}

export type AuthContextType = {
  logIn: (token: string) => void;
  logOut: () => void;
  getUser: () => User | null;
};

const AuthContext = createContext<AuthContextType>({
  logIn: () => {},
  logOut: () => {},
  getUser: () => null,
});

export function useAuth() {
  return useContext(AuthContext);
}

// will ensure that the user is only in pages that they are allowed in
// by looking at what route they are in and redirecting if needed
function useProtectedRoute(user: User | null) {
  const segments = useSegments();
  const router = useRouter();

  console.log(segments);

  useEffect(() => {
    const isInLoginPages = segments[0] === "(auth)";
    const isInOwnerPages = segments[0] === "(owner)";
    const isInCarerPages = segments[0] === "(carer)";

    // if user is not logged in and is in the auth pages then redirect
    // to the landing page
    if (!user && !isInLoginPages) {
      router.replace("/landing");
    }

    // if user is logged in and is trying to log it then redirect to the
    // home page
    if (user && isInLoginPages) {
      router.replace("/home");
    }

    // if owner is in carer pages redirect them
    if (user?.type === "owner" && isInCarerPages) {
      router.replace("/home");
    }

    // if owner is in carer pages redirect them
    if (user?.type === "carer" && isInOwnerPages) {
      router.replace("/home");
    }
  }, [user, segments]);
}

export function AuthProvider(props: any) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState("");

  const storeToken = async () => {
    console.log("storing token");
    // if token user is verified, store the token in secure store
    try {
      await SecureStore.setItemAsync("token", token);
    } catch (e) {
      console.error(e);
      return;
    }

    // no need for try as this token has already been tested
    const decode = JWT.decode(token, JWT_SECRET);
    console.log("user from storeToken: ", decode);

    // set this token to be sent with every axios call
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const newUser: User = decode["user"] as User;

    console.log("new user", newUser);

    setUser(newUser);
  };

  const deleteToken = async () => {
    console.log("deleting token");
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
      // if (ignore) return;
      console.log(
        "token is currently",
        await SecureStore.getItemAsync("token")
      );

      if (token === "") {
        await deleteToken();
        return;
      }

      await storeToken();
      console.log("token is now", await SecureStore.getItemAsync("token"));
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
      JWT.decode<User>(token, JWT_SECRET, { iss: "pet-carer.com" });
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
    <AuthContext.Provider value={{ logIn, logOut, getUser }}>
      {props.children}
    </AuthContext.Provider>
  );
}
