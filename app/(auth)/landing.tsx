import { View } from "react-native";
import { Title } from "react-native-paper";
import { Link } from "expo-router";

export default function Landing() {
    return (
        <View>
            <Title>Landing page</Title>
            <Link href="/login">Login page</Link>
            <Link href="/signup">Signup</Link>
        </View>
    );
}