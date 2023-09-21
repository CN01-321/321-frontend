import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router"
import { Text, List, Divider, Button, useTheme } from "react-native-paper";
import DynamicAvatar from "./DynamicAvatar";
import ProfileListItem from "./ProfileListItem";
import { User } from "../types/types";

import EditIcon from "../assets/icons/edit.svg";
import EmailIcon from "../assets/icons/profile/email.svg";
import PhoneIcon from "../assets/icons/profile/phone.svg";
import AddressIcon from "../assets/icons/profile/address.svg";
import AboutMeIcon from "../assets/icons/profile/aboutme.svg";

const icon = require("../assets/icon.png");

type UserProfileInfoViewProp = {
  user: User;
}

// TODO: add carer fields

const UserProfileInfoView = ({ user }: UserProfileInfoViewProp) => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={styles.view}>
      <View style={styles.pfpAndNameContainer}>
        <DynamicAvatar pfp={user.pfp} defaultPfp={icon} size={120} />
        <Text style={styles.fullName}>{user.name}</Text>
        <Button
          mode="text" 
          labelStyle={styles.editButtonStyle} 
          contentStyle={{ flexDirection: "row-reverse" }}
          onPress={() => router.push(`/profile/edit`)}
          icon={() => <EditIcon height={22} width={22} fill={theme.colors.primary} />}
        >
          Tap Here to Edit Profile
        </Button>
      </View>
      <List.Section>
        <List.Subheader style={styles.subheadingStyle}>CONTACT DETAILS & ADDRESS</List.Subheader>
        <ProfileListItem
          title="Email Address"
          description={user.email}
          icon={() => <EmailIcon height={25} width={25} fill={theme.colors.primary} />}
        />
        <Divider />
        <ProfileListItem
          title="Phone Number" 
          description={user.phone} 
          icon={() => <PhoneIcon height={25} width={25} fill={theme.colors.primary} />}
        />
        <Divider />
        <ProfileListItem
          title="Address" 
          description={`${user.location?.street}, ${user.location?.city}, ${user.location?.state} ${user.location?.postcode}`} 
          icon={() => <AddressIcon height={25} width={25} fill={theme.colors.primary} />}
        />
      </List.Section>
      <List.Section>
        <List.Subheader style={styles.subheadingStyle}>
          { 
            user.userType == "owner"
              ? "OWNER DETAILS"
              : "SERVICE DETAILS"
          }
        </List.Subheader>
        <ProfileListItem 
          title="About Me" 
          description={user.bio} 
          icon={() => <AboutMeIcon height={25} width={25} fill={theme.colors.primary} />}
        />
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 15,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 30,
  },
  pfpAndNameContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 5
  },
  fullName: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    color: "#000000"
  },
  editButtonStyle: {
    color: "#777777",
    fontFamily: "Montserrat-Medium",
  },
  subheadingStyle: {
    color: "#777777",
    fontFamily: "Montserrat-Medium",
  }
});
 
export default UserProfileInfoView;