import { View, ScrollView, StyleSheet } from "react-native";
import {
  Text,
  Checkbox,
  Button,
  List,
  Divider,
  useTheme,
} from "react-native-paper";
import { useRouter } from "expo-router";
import DynamicAvatar from "../DynamicAvatar";
import ProfileListItem from "../ProfileListItem";
import { Pet } from "../../types/types";

import EditIcon from "../../../assets/icons/edit.svg";
import PawIcon from "../../../assets/icons/pet/paw.svg";
import ScalesIcon from "../../../assets/icons/pet/scale.svg";
import StatusIcon from "../../../assets/icons/pet/status.svg";

type PetInfoViewProp = {
  pet: Pet;
};

const PetInfoView = ({ pet }: PetInfoViewProp) => {
  const theme = useTheme();
  const router = useRouter();

  const editHref = {
    pathname: `/pet/edit`,
    params: { petId: pet._id },
  };

  return (
    <ScrollView>
      <View style={styles.view}>
        <View style={styles.pfpAndNameContainer}>
          <DynamicAvatar pfp={pet.pfp} defaultPfp={pet.petType} size={120} />
          <Text style={styles.petName}>{pet.name}</Text>
          <Button
            mode="text"
            labelStyle={styles.editButtonStyle}
            contentStyle={{ flexDirection: "row-reverse" }}
            onPress={() => router.push(editHref)}
            icon={() => (
              <EditIcon height={22} width={22} fill={theme.colors.primary} />
            )}
          >
            Tap Here to Edit Profile
          </Button>
        </View>
        <List.Section>
          <List.Subheader style={styles.subheadingStyle}>
            PET INFORMATION
          </List.Subheader>
          <ProfileListItem
            title="Type"
            description={
              pet.petType.charAt(0).toUpperCase() + pet.petType.slice(1)
            } // Capitalise first letter
            icon={() => (
              <PawIcon height={25} width={25} fill={theme.colors.primary} />
            )}
          />
          <Divider />
          <ProfileListItem
            title="Size"
            description={
              pet.petSize.charAt(0).toUpperCase() + pet.petSize.slice(1)
            } // Capitalise first letter
            icon={() => (
              <ScalesIcon height={25} width={25} fill={theme.colors.primary} />
            )}
          />
          <Divider />
          <View style={styles.statusBox}>
            <View style={styles.statusBoxHeadingContainer}>
              <StatusIcon height={25} width={25} fill={theme.colors.primary} />
              <Text style={styles.statusBoxHeading}>Status</Text>
            </View>
            <View style={styles.statusOptionsContainer}>
              <View style={styles.statusOption}>
                <Text style={styles.statusOptionLabel}>Vaccinated</Text>
                <Checkbox status={pet.isVaccinated ? "checked" : "unchecked"} />
              </View>
              <Divider />
              <View style={styles.statusOption}>
                <Text style={styles.statusOptionLabel}>Friendly</Text>
                <Checkbox status={pet.isFriendly ? "checked" : "unchecked"} />
              </View>
              <Divider />
              <View style={styles.statusOption}>
                <Text style={styles.statusOptionLabel}>Neutered</Text>
                <Checkbox status={pet.isNeutered ? "checked" : "unchecked"} />
              </View>
            </View>
          </View>
        </List.Section>
      </View>
    </ScrollView>
  );
};

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
    gap: 5,
  },
  petName: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    color: "#000000",
  },
  editButtonStyle: {
    color: "#777777",
    fontFamily: "Montserrat-Medium",
  },
  subheadingStyle: {
    color: "#777777",
    fontFamily: "Montserrat-Medium",
  },
  statusBox: {
    padding: 17,
  },
  statusBoxHeadingContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  statusBoxHeading: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 15,
  },
  statusOptionsContainer: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  statusOption: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
  statusOptionLabel: {
    fontFamily: "Montserrat-Medium",
    color: "#505050",
  },
});

export default PetInfoView;
