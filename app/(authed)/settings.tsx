import { StyleSheet, View } from "react-native";
import { List, useTheme } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/src/components/Icon";
import { useRouter } from "expo-router";

import { useAuth } from "../../contexts/auth";
import Header from "../../components/Header";

import EditProfileIcon from "../../assets/icons/settings/editprofile.svg";
import EditLocationIcon from "../../assets/icons/settings/editlocation.svg";
import ResetPasswordIcon from "../../assets/icons/settings/resetpassword.svg";
import DeleteAccountIcon from "../../assets/icons/settings/deleteaccount.svg";
import LogOutIcon from "../../assets/icons/settings/logout.svg";
import ContactUsIcon from "../../assets/icons/settings/contactus.svg";
import AboutUsIcon from "../../assets/icons/settings/aboutus.svg";
import TermsOfServiceIcon from "../../assets/icons/settings/termsofservice.svg";
import PrivacyPolicyIcon from "../../assets/icons/settings/privacypolicy.svg";
import { useMessageSnackbar } from "../../contexts/messageSnackbar";

export default function Settings() {
  const theme = useTheme();
  const router = useRouter();
  const { logOut } = useAuth();

  const { pushError } = useMessageSnackbar();

  return (
    <View>
      <Header title="Settings" />
      <View style={styles.pageContainer}>
        <List.Section>
          <List.Subheader style={styles.listSubHeading}>Account</List.Subheader>
          <SettingsOption
            name="Edit Profile"
            icon={() => (
              <EditProfileIcon
                height={30}
                width={30}
                fill={theme.colors.primary}
              />
            )}
            onPress={() => router.push(`/profile/edit`)}
          />
          <SettingsOption
            name="Edit Location"
            icon={() => (
              <EditLocationIcon
                height={30}
                width={30}
                fill={theme.colors.primary}
              />
            )}
            onPress={() => pushError("Button not implemented")}
          />
          <SettingsOption
            name="Reset Password"
            icon={() => (
              <ResetPasswordIcon
                height={30}
                width={30}
                fill={theme.colors.primary}
              />
            )}
            onPress={() => pushError("other Button not implemented")}
          />
          <SettingsOption
            name="Delete Account"
            icon={() => (
              <DeleteAccountIcon
                height={30}
                width={30}
                fill={theme.colors.primary}
              />
            )}
          />
          <SettingsOption
            name="Log Out"
            icon={() => (
              <LogOutIcon height={30} width={30} fill={theme.colors.primary} />
            )}
            onPress={logOut}
          />
        </List.Section>
        <List.Section>
          <List.Subheader style={styles.listSubHeading}>About</List.Subheader>
          <SettingsOption
            name="Contact Us"
            icon={() => (
              <ContactUsIcon
                height={30}
                width={30}
                fill={theme.colors.primary}
              />
            )}
          />
          <SettingsOption
            name="About Us"
            icon={() => (
              <AboutUsIcon height={30} width={30} fill={theme.colors.primary} />
            )}
          />
          <SettingsOption
            name="Terms of Service"
            icon={() => (
              <TermsOfServiceIcon
                height={30}
                width={30}
                fill={theme.colors.primary}
              />
            )}
          />
          <SettingsOption
            name="Privacy Policy"
            icon={() => (
              <PrivacyPolicyIcon
                height={30}
                width={30}
                fill={theme.colors.primary}
              />
            )}
          />
        </List.Section>
      </View>
    </View>
  );
}

type SettingsOptionProps = {
  name: String;
  icon: IconSource;
  onPress?: () => void;
};

const SettingsOption = ({ name, icon, onPress }: SettingsOptionProps) => {
  return (
    <List.Item
      style={styles.listItemContainer}
      title={name}
      left={(props) => <List.Icon {...props} icon={icon} />}
      right={(props) => (
        <List.Icon {...props} icon="chevron-right" color="#000000" />
      )}
      onPress={onPress}
      titleStyle={styles.listItemTitle}
    />
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: "#FCFCFC",
    height: "100%",
  },
  listItemContainer: {
    height: 45,
    justifyContent: "center",
  },
  listSubHeading: {
    fontFamily: "Montserrat-Bold",
    fontSize: 22,
    color: "#000000",
  },
  listItemTitle: {
    fontFamily: "Montserrat-Medium",
    fontSize: 17,
    color: "#777777",
  },
});
