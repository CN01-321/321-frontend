import { ScrollView, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Text, List, Divider, Button, useTheme } from "react-native-paper";
import DynamicAvatar from "../DynamicAvatar";
import ProfileListItem from "../ProfileListItem";
import { CarerProfile } from "../../types/types";

import EditIcon from "../../../assets/icons/edit.svg";
import EmailIcon from "../../../assets/icons/profile/email.svg";
import PhoneIcon from "../../../assets/icons/profile/phone.svg";
import AddressIcon from "../../../assets/icons/profile/address.svg";
import AboutMeIcon from "../../../assets/icons/profile/aboutme.svg";
import CarIcon from "../../../assets/icons/profile/car.svg";
import PawIcon from "../../../assets/icons/pet/paw.svg";
import ScalesIcon from "../../../assets/icons/pet/scale.svg";
import DollarIcon from "../../../assets/icons/profile/dollar.svg";
import Star from "../Star";

type CarerProfileInfoViewProp = {
  carer: CarerProfile;
  isSelf: boolean;
};

const CarerProfileInfoView = ({ carer, isSelf }: CarerProfileInfoViewProp) => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <ScrollView
      style={[styles.view, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.pfpAndNameContainer}>
        <DynamicAvatar pfp={carer.pfp} defaultPfp="user" size={120} />
        <Text style={styles.fullName}>{carer.name}</Text>
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
        <CarerStats
          totalReviews={carer.totalReviews}
          rating={carer.rating ?? 0}
          completedJobs={carer.completedJobs}
        />
      </View>
      <List.Section>
        <List.Subheader style={styles.subheadingStyle}>
          CONTACT DETAILS & ADDRESS
        </List.Subheader>
        <ProfileListItem
          title="Email Address"
          description={carer.email}
          icon={() => (
            <EmailIcon height={25} width={25} fill={theme.colors.primary} />
          )}
        />
        <Divider />
        <ProfileListItem
          title="Phone Number"
          description={carer.phone}
          icon={() => (
            <PhoneIcon height={25} width={25} fill={theme.colors.primary} />
          )}
        />
        <Divider />
        <ProfileListItem
          title="Address"
          description={`${carer.location?.street}, ${carer.location?.city}, ${carer.location?.state} ${carer.location?.postcode}`}
          icon={() => (
            <AddressIcon height={25} width={25} fill={theme.colors.primary} />
          )}
        />
      </List.Section>
      <List.Section>
        <List.Subheader style={styles.subheadingStyle}>
          SERVICE DETAILS
        </List.Subheader>
        <ProfileListItem
          title="About Me"
          description={carer.bio}
          icon={() => (
            <AboutMeIcon height={25} width={25} fill={theme.colors.primary} />
          )}
        />
        <Divider />
        <ProfileListItem
          title="Maximum Travel Distance"
          description={`${carer.preferredTravelDistance} km`}
          icon={() => (
            <CarIcon height={25} width={25} fill={theme.colors.primary} />
          )}
        />
        <Divider />
        <ProfileListItem
          title="Types of Pets"
          description={carer.preferredPetTypes.join(" ")}
          icon={() => (
            <PawIcon height={25} width={25} fill={theme.colors.primary} />
          )}
        />
        <Divider />
        <ProfileListItem
          title="Size of Pets"
          description={carer.preferredPetSizes.join(" ")}
          icon={() => (
            <ScalesIcon height={25} width={25} fill={theme.colors.primary} />
          )}
        />
        <Divider />
        <ProfileListItem
          title="Hourly Rate"
          description={`$${carer.hourlyRate}/hr`}
          icon={() => (
            <DollarIcon height={25} width={25} fill={theme.colors.primary} />
          )}
        />
      </List.Section>
    </ScrollView>
  );
};

interface CarerStatsProps {
  totalReviews: number;
  rating: number;
  completedJobs: number;
}

function CarerStats({ totalReviews, rating, completedJobs }: CarerStatsProps) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
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
          {completedJobs}
        </Text>
        <Text style={styles.statsInfoText}>Completed Jobs</Text>
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

export default CarerProfileInfoView;
