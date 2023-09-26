import { ScrollView, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router"
import { Text, List, Divider, Button, useTheme } from "react-native-paper";
import DynamicAvatar from "./DynamicAvatar";
import ProfileListItem from "./ProfileListItem";
import { Owner } from "../types/types";

import EditIcon from "../assets/icons/edit.svg";
import EmailIcon from "../assets/icons/profile/email.svg";
import PhoneIcon from "../assets/icons/profile/phone.svg";
import AddressIcon from "../assets/icons/profile/address.svg";
import AboutMeIcon from "../assets/icons/profile/aboutme.svg";

const icon = require("../assets/icon.png");

type OwnerProfileInfoViewProp = {
  owner: Owner;
}

const OwnerProfileInfoView = ({ owner }: OwnerProfileInfoViewProp) => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <ScrollView>
      <View style={styles.view}>
        <View style={styles.pfpAndNameContainer}>
          <DynamicAvatar pfp={owner.pfp} defaultPfp={icon} size={120} />
          <Text style={styles.fullName}>{owner.name}</Text>
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
            description={owner.email}
            icon={() => <EmailIcon height={25} width={25} fill={theme.colors.primary} />}
          />
          <Divider />
          <ProfileListItem
            title="Phone Number" 
            description={owner.phone} 
            icon={() => <PhoneIcon height={25} width={25} fill={theme.colors.primary} />}
          />
          <Divider />
          <ProfileListItem
            title="Address" 
            description={`${owner.location?.street}, ${owner.location?.city}, ${owner.location?.state} ${owner.location?.postcode}`} 
            icon={() => <AddressIcon height={25} width={25} fill={theme.colors.primary} />}
          />
        </List.Section>
        <List.Section>
          <List.Subheader style={styles.subheadingStyle}>OWNER DETAILS</List.Subheader>
          <ProfileListItem 
            title="About Me" 
            description={owner.bio} 
            icon={() => <AboutMeIcon height={25} width={25} fill={theme.colors.primary} />}
          />
        </List.Section>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  view: {
    display: "flex",
    flexDirection: "column",
    paddingTop: 15,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 30,
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
 
export default OwnerProfileInfoView;