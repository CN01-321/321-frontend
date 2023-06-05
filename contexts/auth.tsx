// based off of https://expo.github.io/router/docs/guides/auth/
import { useRouter, useSegments } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

type UserType = 'owner' | 'carer';

export interface User {
    email: string,
    password: string,
    type: UserType
}

export type AuthContextType = {
    logIn: (user: User) => void,
    logOut: () => void
}

const AuthContext = createContext<AuthContextType>({
    logIn: (user: User) => {},
    logOut: () => {}
});

export function useAuth() {
    return useContext(AuthContext);
}

function useProtectedRoute(user: User | null) {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const isInLoginPages = segments[0] === '(auth)';

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

    }, [user, segments]);
}

export function AuthProvider(props: any) {
    const [user, setAuth] = useState<User | null>(null);

    useProtectedRoute(user);

    return (
        <AuthContext.Provider
            value={{ 
                logIn: (user) => setAuth(user), 
                logOut: () => setAuth(null),
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}