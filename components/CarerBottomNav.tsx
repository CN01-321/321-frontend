import { useRouter } from "expo-router";
import { useState } from "react";
import { BottomNavigation } from "react-native-paper";

export default function CarerBottomNav() {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        {key: 'home', title: 'Home', focusedIcon: 'home-circle', unfocused: 'home-circle-outline'},
        {key: 'offers', title: 'Offers', focusedIcon: 'pencil-box-multiple', unfocused: 'pencil-box-multiple-outline'},
        {key: 'jobs', title: 'Jobs', focusedIcon: 'briefcase', unfocused: 'briefcase-outline'},
        {key: 'profile', title: 'Profile', focusedIcon: 'account', unfocused: 'account-outline'},
    ]);

    const router = useRouter();

    return (
        <BottomNavigation.Bar
            navigationState={{index, routes}}
            onTabPress={({route}) => {
                setIndex(routes.findIndex(r => r.key === route.key));
                router.push(route.key);
            }}
        />
    );
}