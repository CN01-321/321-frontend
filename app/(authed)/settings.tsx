import { StyleSheet, View } from "react-native";
import { List, useTheme } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/src/components/Icon";

import { useAuth } from "../../contexts/auth";
import Header from "../../components/Header";

import EditProfileIcon from "../../assets/editprofile.svg";
import EditLocationIcon from "../../assets/editlocation.svg";
import ResetPasswordIcon from "../../assets/resetpassword.svg";
import DeleteAccountIcon from "../../assets/deleteaccount.svg";
import LogOutIcon from "../../assets/logout.svg";
import ContactUsIcon from "../../assets/contactus.svg";
import AboutUsIcon from "../../assets/aboutus.svg";
import TermsOfServiceIcon from "../../assets/termsofservice.svg";
import PrivacyPolicyIcon from "../../assets/privacypolicy.svg";

export default function Settings() {
  const theme = useTheme();
  const { logOut } = useAuth();

  return (
    <View>
      <Header
        title="Settings"
      />
      <View style={styles.pageContainer}>
        <List.Section>
          <List.Subheader style={styles.listSubHeading}>Account</List.Subheader>
          <SettingsOption 
            name="Edit Profile"
            icon={() => <EditProfileIcon fill={theme.colors.primary} />} 
          />
          <SettingsOption 
            name="Edit Location" 
            icon={() => <EditLocationIcon fill={theme.colors.primary} />} 
          />
          <SettingsOption 
            name="Reset Password" 
            icon={() => <ResetPasswordIcon fill={theme.colors.primary} />} 
          />
          <SettingsOption 
            name="Delete Account" 
            icon={() => <DeleteAccountIcon fill={theme.colors.primary} />} 
          />
          <SettingsOption 
            name="Log Out" 
            icon={() => <LogOutIcon fill={theme.colors.primary} />}
            onPress={logOut} 
          />
        </List.Section>
        <List.Section>
          <List.Subheader style={styles.listSubHeading}>About</List.Subheader>
          <SettingsOption 
            name="Contact Us" 
            icon={() => <ContactUsIcon fill={theme.colors.primary} />} 
          />
          <SettingsOption
            name="About Us"
            icon={() => <AboutUsIcon fill={theme.colors.primary} />} 
          />
          <SettingsOption 
            name="Terms of Service"
            icon={() => <TermsOfServiceIcon fill={theme.colors.primary} />} 
          />
          <SettingsOption 
            name="Privacy Policy"
            icon={() => <PrivacyPolicyIcon fill={theme.colors.primary} />} 
          />
        </List.Section>
      </View>
    </View>
  );
}

type SettingsOptionProps = {
  name: String;
  icon: IconSource;
  onPress?: () => void
}

const SettingsOption = ({ name, icon, onPress }: SettingsOptionProps) => {
  return (
    <List.Item
      title={name}
      left={props => <List.Icon {...props} icon={icon} />}
      right={props => <List.Icon {...props} icon="chevron-right" color="#000000" />}
      onPress={onPress}
      titleStyle={styles.listItemTitle}
    />
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: "#FCFCFC",
    height: "100%"
  },
  listSubHeading: {
    fontFamily: "Montserrat-Bold",
    fontSize: 22,
    color: "#000000",
  },
  listItemTitle: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "#777777"
  }
});