// based off of https://expo.github.io/router/docs/guides/auth/
import { useRouter, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import JWT from 'expo-jwt'
import * as SecureStore from 'expo-secure-store'
import { JWT_SECRET } from '@env'


type User = {
    email: string
    type: "owner" | "carer"
}

export type AuthContextType = {
    logIn: (token: string) => void,
    logOut: () => void
}

const AuthContext = createContext<AuthContextType>({
    logIn: () => {},
    logOut: () => {}
});

export function useAuth() {
    return useContext(AuthContext);
}

// will ensure that the user is only in pages that they are allowed in
// by looking at what route they are in and redirecting if needed
function useProtectedRoute(user: User | null) {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const isInLoginPages = segments[0] === '(auth)';
        const isInOwnerPages = segments[0] === '(owner)';
        const isInCarerPages = segments[0] === '(carer)';

        // if user is not logged in and is in the auth pages then redirect
        // to the landing page
        if (!user && !isInLoginPages) {
            router.replace('/landing');
        }

        // if user is logged in and is trying to log it then redirect to the 
        // home page
        if (user && isInLoginPages) {
            router.replace('/home');
        }

        // if owner is in carer pages redirect them 
        if (user?.type === 'owner' && isInCarerPages) {
            // todo redirect to owner main page
        }

        // if owner is in carer pages redirect them 
        if (user?.type === 'carer' && isInOwnerPages) {
            // todo redirect to carer main page
        }
    }, [user, segments]);
}

export function AuthProvider(props: any) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState("");

    // set the user whenever the token is reset or changed 
    // and store/remove token from secure storage
    useEffect((): (() => void) => {
        console.log('token has changed', token)

        // prevent race conditions see "note on fetching data inside useeffect"
        // https://devtrium.com/posts/async-functions-useeffect
        let ignore = false;

        (async () => {
            if (ignore) return;

            let user = null;

            if (token === "") {
                console.log("deleting token")
                await SecureStore.deleteItemAsync('token');
            } else {
                console.log("storing token")
                // if token user is verified, store the token in secure store
                await SecureStore.setItemAsync('token', token);
                // no need for try as this token has already been tested
                const decode = JWT.decode<User>(token, JWT_SECRET);
                console.log(decode);
                user = decode.user;
            }
            
            setUser(user)
            console.log("set user", user)
        }) ()

        return () => ignore = true;
    }, [token])

    // load the token when page/app loads, if there is one
    useEffect((): (() => void) => {
        let ignore = false;

        (async () => {
            let token = await SecureStore.getItemAsync('token');
            if (token && !ignore) {
                // calling set token will call the other useeffect which will
                // update the user
                setToken(token);
            }
        }) ()

        return () => ignore = true
    }, [])

    const logIn = async (token: string) => {
        try {
            // verify the JWT is valid
            JWT.decode<User>(token, JWT_SECRET, { iss: 'pet-carer.com'})
            setToken(token)
            console.log("token is valid and set token")
        } catch (e) {
            console.error(e)
        }
    }

    const logOut = async () => {
        setToken("")
    }

    useProtectedRoute(user);

    return (
        <AuthContext.Provider value={{ logIn, logOut }}>
            {props.children}
        </AuthContext.Provider>
    );
}