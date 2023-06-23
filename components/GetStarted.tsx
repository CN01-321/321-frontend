import { useRouter } from "expo-router";
import { UserType } from "../contexts/auth";
import { Button } from "react-native-paper";
import { View } from "react-native";

export default function GetStarted({userType}: {userType: UserType}) {
    const router = useRouter();

    const colour = (userType === "owner") ? "brown" : "yellow";

    return (
        <View>
            <Button 
                mode="contained" 
                onPress={() => router.push(`/(auth)/${userType}/signup`)}
                theme={{ colors: { primary: colour } }}
            >
                Get Started
            </Button>
        </View>
    );
}