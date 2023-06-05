import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Title } from "react-native-paper";

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const signup = async () => {
        try {
            await axios.post('/signup', {
                email,
                password
            });
            console.log(`logged in with: ${email} and ${password}`);
            router.replace('/login');
        } catch (error) {
            console.error(error);
        }
    } 

    return (
        <View>
            <Title>Sign Up</Title>
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

            <Button mode="contained" onPress={signup}>Login</Button>
        </View>
    );
}