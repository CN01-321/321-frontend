import {
  Avatar,
  Button,
  Card,
  Divider,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Pressable,
} from "react-native";
import { useAuth } from "../../contexts/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { Review } from "../../components/ReviewsView";
import DynamicCardCover from "../../components/DynamicCardCover";
import DynamicAvatar from "../../components/DynamicAvatar";
import { StarRating } from "../../components/StarRating";
import { toDDMMYYYY } from "../../utils";
import { UserType } from "../../types";
import { Link, useRouter } from "expo-router";
import Star from "../../components/Star";
import { useErrorSnackbar } from "../../contexts/errorSnackbar";

const icon = require("../../assets/icon.png");

interface TopCarer {
  _id: string;
  name: string;
  pfp: string;
  rating?: number;
  totalReviews: number;
  recentReview?: Review;
}

interface HomeInfo {
  name: string;
  completed: number;
  pending: number;
  current: number;
  recentReviews?: Review[];
  topCarers: TopCarer[];
}

export default function Home() {
  const { getTokenUser, logOut } = useAuth();
  const [homeInfo, setHomeInfo] = useState<HomeInfo>({} as HomeInfo);
  const theme = useTheme();
  const { pushError } = useErrorSnackbar();

  const userType = getTokenUser()?.type ?? "owner";

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      try {
        const { data } = await axios.get<HomeInfo>(`/${userType}s/home`);

        if (!ignore) setHomeInfo(data);
      } catch (e) {
        console.error(e);
        pushError("Could not fetch home page information");
      }
    })();

    return () => (ignore = true);
  }, []);

  return (
    <SafeAreaView
      style={{ ...styles.container, backgroundColor: theme.colors.background }}
    >
      <Header title="Home" showButtons={true} />
      <GreetingCard homeInfo={homeInfo} userType={userType} />
      <HomeInfoCard homeInfo={homeInfo} userType={userType} />
      <TopCarerView homeInfo={homeInfo} />
      {userType === "owner" ? (
        <OwnerHomeReviewView homeInfo={homeInfo} />
      ) : (
        <CarerHomeReviewView homeInfo={homeInfo} />
      )}
    </SafeAreaView>
  );
}

function GreetingCard({
  homeInfo,
  userType,
}: {
  homeInfo: HomeInfo;
  userType: UserType;
}) {
  const type = userType === "owner" ? "request" : "job";
  const typeCapital = userType === "owner" ? "Request" : "Job";

  return (
    <View style={styles.greeting}>
      <View style={{ flexDirection: "column" }}>
        <Text variant="titleLarge">Hello {homeInfo.name},</Text>
        <Text variant="bodySmall">Your total pending {type}s are:</Text>
      </View>
      <View style={{ padding: 20, paddingLeft: "10%", alignContent: "center" }}>
        <Text variant="titleLarge">
          {homeInfo.pending} {typeCapital}
          {homeInfo.pending != 1 ? "s" : null}
        </Text>
      </View>
    </View>
  );
}

function HomeInfoCard({
  homeInfo,
  userType,
}: {
  homeInfo: HomeInfo;
  userType: UserType;
}) {
  const theme = useTheme();

  const VericalDivider = () => (
    <Divider
      theme={{
        ...theme,
        colors: {
          ...theme.colors,
          outlineVariant: theme.colors.background,
        },
      }}
      style={{ width: 1, height: "100%", marginHorizontal: 5 }}
    />
  );

  const type = userType === "owner" ? "Request" : "Job";
  const completed = `Completed\n${type}${homeInfo.completed != 1 ? "s" : ""}`;
  const pending = `Pending\n${type}${homeInfo.pending != 1 ? "s" : ""}`;
  const current = `Current\n${type}${homeInfo.current != 1 ? "s" : ""}`;

  return (
    <Card
      theme={{
        ...theme,
        colors: {
          ...theme.colors,
          elevation: {
            ...theme.colors.elevation,
            level1: theme.colors.primary,
          },
        },
      }}
      style={{ margin: 10 }}
    >
      <Card.Content
        style={{
          flex: 1,
          flexDirection: "row",
          flexBasis: 100,
          flexShrink: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.homeInfoSegment}>
          <Text variant="headlineMedium" style={styles.homeInfoText}>
            {homeInfo.completed}
          </Text>
          <Text style={styles.homeInfoText}>{completed}</Text>
        </View>
        <VericalDivider />
        <View style={styles.homeInfoSegment}>
          <Text variant="headlineMedium" style={styles.homeInfoText}>
            {homeInfo.pending}
          </Text>
          <Text style={styles.homeInfoText}>{pending}</Text>
        </View>
        <VericalDivider />
        <View style={styles.homeInfoSegment}>
          <Text variant="headlineMedium" style={styles.homeInfoText}>
            {homeInfo.current}
          </Text>
          <Text style={styles.homeInfoText}>{current}</Text>
        </View>
      </Card.Content>
    </Card>
  );
}

function TopCarerView({ homeInfo }: { homeInfo: HomeInfo }) {
  return (
    <View>
      <Text style={styles.segmentTitle} variant="titleMedium">
        Top Carers in the Area
      </Text>
      <FlatList
        style={{ overflow: "visible" }}
        horizontal={true}
        data={homeInfo.topCarers}
        renderItem={({ item }) => <TopCarerCard carer={item} />}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}

function TopCarerCard({ carer }: { carer: TopCarer }) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/profile/overview",
      params: { profileId: carer._id },
    });
  };

  return (
    <View style={{ margin: 5 }}>
      <Pressable onPress={handlePress}>
        <DynamicCardCover
          style={{ zIndex: 0, width: 180, height: 180 }}
          imageId={carer.pfp}
          defaultImage={icon}
        />
        <Card.Content style={{ paddingLeft: 5, height: 50 }}>
          <Text style={{ paddingTop: 5 }} variant="titleSmall">
            {carer.name}
          </Text>
          <View
            style={{
              marginBottom: 20,
              flexDirection: "row",
            }}
          >
            {carer.rating ? (
              <>
                <Star size={15} />
                <Text style={{ paddingLeft: 5 }} variant="bodySmall">
                  {carer.rating.toFixed(1)} ({carer.totalReviews} reviews)
                </Text>
              </>
            ) : null}
          </View>
        </Card.Content>
      </Pressable>
    </View>
  );
}

function OwnerHomeReviewView({ homeInfo }: { homeInfo: HomeInfo }) {
  return (
    <View>
      <Text style={styles.segmentTitle} variant="titleMedium">
        Top Carers Reviews
      </Text>
      <FlatList
        style={{ overflow: "visible" }}
        horizontal={true}
        data={homeInfo.topCarers}
        renderItem={({ item }) =>
          item.recentReview ? (
            <TopReviewCard review={item.recentReview} carer={item} />
          ) : null
        }
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}

function CarerHomeReviewView({ homeInfo }: { homeInfo: HomeInfo }) {
  return (
    <View>
      <Text style={styles.segmentTitle} variant="titleMedium">
        Your Recent Reviews
      </Text>
      <FlatList
        style={{ overflow: "visible" }}
        horizontal={true}
        data={homeInfo.recentReviews}
        renderItem={({ item }) => <TopReviewCard review={item} />}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}

function TopReviewCard({
  review,
  carer,
}: {
  review: Review;
  carer?: TopCarer;
}) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/profile/overview",
      params: {
        profileId: carer ? carer._id : review.authorId,
      },
    });
  };

  return (
    <Card
      style={{ minWidth: 200, maxWidth: 300, margin: 2 }}
      onPress={handlePress}
    >
      <Card.Content>
        <View
          style={{
            flexDirection: "row",
            alignContent: "flex-start",
          }}
        >
          <DynamicAvatar pfp={review.authorIcon} defaultPfp={icon} size={30} />
          <Text style={{ paddingLeft: 6, flex: 1 }} variant="titleSmall">
            {review.authorName}{" "}
            {carer ? (
              <Text variant="bodyMedium">
                has reviewed<Text variant="titleSmall"> {carer.name}</Text>
              </Text>
            ) : null}
          </Text>
          <Text style={{ paddingLeft: 3 }} variant="bodySmall">
            {toDDMMYYYY(new Date(review.postedOn))}
          </Text>
        </View>
        {review.rating ? <StarRating stars={review.rating} size={15} /> : null}
        <Text variant="bodyMedium">{review.message}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 25,
    justifyContent: "space-evenly",
  },
  greeting: {
    flexDirection: "row",
    paddingTop: 10,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  segmentTitle: {
    paddingVertical: 5,
  },
  homeInfoSegment: {
    width: 100,
  },
  homeInfoText: {
    color: "white",
    textAlign: "center",
  },
});
