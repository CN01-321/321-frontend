import { View, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Text, List, Divider, Button, useTheme } from "react-native-paper";
import DynamicAvatar from "../DynamicAvatar";
import ProfileListItem from "../ProfileListItem";
import { OwnerProfile } from "../../types/types";

import EditIcon from "../../../assets/icons/edit.svg";
import EmailIcon from "../../../assets/icons/profile/email.svg";
import PhoneIcon from "../../../assets/icons/profile/phone.svg";
import AddressIcon from "../../../assets/icons/profile/address.svg";
import AboutMeIcon from "../../../assets/icons/profile/aboutme.svg";
import Star from "../Star";

type OwnerProfileInfoViewProp = {
  owner: OwnerProfile;
  isSelf: boolean;
};

const OwnerProfileInfoView = ({ owner, isSelf }: OwnerProfileInfoViewProp) => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <ScrollView
      style={[styles.view, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.pfpAndNameContainer}>
        <DynamicAvatar pfp={owner.pfp} defaultPfp="user" size={120} />
        <Text style={styles.fullName}>{owner.name}</Text>
        {isSelf ? (
          <Button
            mode="text"
            labelStyle={styles.editButtonStyle}
            contentStyle={{ flexDirection: "row-reverse" }}
            onPress={() => router.push(`/profile/edit`)}
            icon={() => (
              <EditIcon height={22} width={22} fill={theme.colors.primary} />
            )}
          >
            Tap Here to Edit Profile
          </Button>
        ) : null}
        <OwnerStats
          totalReviews={owner.totalReviews}
          rating={owner.rating ?? 0}
          numPets={owner.numPets}
        />
      </View>
      <List.Section>
        <List.Subheader style={styles.subheadingStyle}>
          CONTACT DETAILS & ADDRESS
        </List.Subheader>
        <ProfileListItem
          title="Email Address"
          description={owner.email}
          icon={() => (
            <EmailIcon height={25} width={25} fill={theme.colors.primary} />
          )}
        />
        <Divider />
        <ProfileListItem
          title="Phone Number"
          description={owner.phone}
          icon={() => (
            <PhoneIcon height={25} width={25} fill={theme.colors.primary} />
          )}
        />
        <Divider />
        <ProfileListItem
          title="Address"
          description={`${owner.location?.street}, ${owner.location?.city}, ${owner.location?.state} ${owner.location?.postcode}`}
          icon={() => (
            <AddressIcon height={25} width={25} fill={theme.colors.primary} />
          )}
        />
      </List.Section>
      <List.Section>
        <List.Subheader style={styles.subheadingStyle}>
          OWNER DETAILS
        </List.Subheader>
        <ProfileListItem
          title="About Me"
          description={owner.bio}
          icon={() => (
            <AboutMeIcon height={25} width={25} fill={theme.colors.primary} />
          )}
        />
      </List.Section>
    </ScrollView>
  );
};

interface OwnerStatsProps {
  totalReviews: number;
  rating: number;
  numPets: number;
}

function OwnerStats({ totalReviews, rating, numPets }: OwnerStatsProps) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
      }}
    >
      <View style={styles.statsInfoSegment}>
        <Text variant="headlineMedium" style={styles.statsInfoText}>
          {totalReviews}
        </Text>
        <Text style={styles.statsInfoText}>Reviews</Text>
      </View>
      <View style={styles.statsInfoSegment}>
        <Text variant="headlineMedium" style={styles.statsInfoText}>
          {rating.toFixed(1)}
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Star size={15} />
          <Text style={styles.statsInfoText}>Star Reviews</Text>
        </View>
      </View>
      <View style={styles.statsInfoSegment}>
        <Text variant="headlineMedium" style={styles.statsInfoText}>
          {numPets}
        </Text>
        <Text style={styles.statsInfoText}>Pets</Text>
      </View>
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
    gap: 5,
  },
  fullName: {
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
  statsInfoSegment: {
    flex: 1,
  },
  statsInfoText: {
    textAlign: "center",
  },
});

export default OwnerProfileInfoView;
