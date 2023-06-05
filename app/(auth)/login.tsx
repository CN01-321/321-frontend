import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput, Title } from "react-native-paper";
import { useAuth } from "../../contexts/auth";
import axios from "axios";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { logIn } = useAuth();

    const login = () => {
        try {
            const token = axios.post('/login');
            // decode token
            
        } catch (error) {
            console.error(error);
        }

        console.log(`logged in with: ${email} and ${password}`);
    } 

    return (
        <View>
            <Title>Log In</Title>
            <TextInput
                label="Email"
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <TextInput
                label="Password"
                value={password}
                secureTextEntry
                onChangeText={text => setPassword(text)}
            />

            <Button mode="contained" onPress={login}>Login</Button>
        </View>
    );
}