import { Button, Card, Divider, Text, useTheme } from "react-native-paper";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import { useAuth } from "../../contexts/auth";
import Header from "../../components/Header";
import { Review } from "../../components/views/ReviewsView";
import DynamicCardCover from "../../components/DynamicCardCover";
import DynamicAvatar from "../../components/DynamicAvatar";
import { StarRating } from "../../components/StarRating";
import { toDDMMYYYY } from "../../utilities/utils";
import { UserType } from "../../types/types";
import { useRouter } from "expo-router";
import Star from "../../components/Star";
import { useUser } from "../../contexts/user";

interface TopCarer {
  _id: string;
  name: string;
  pfp: string;
  rating?: number;
  totalReviews: number;
  recentReview?: Review;
}

export interface HomeInfo {
  name: string;
  completed: number;
  pending: number;
  current: number;
  recentReviews?: Review[];
  topCarers: TopCarer[];
}

export default function Home() {
  const { getTokenUser, logOut } = useAuth();
  const theme = useTheme();
  const { getHomeInfo } = useUser();

  const userType = getTokenUser()?.type ?? "owner";

  const homeInfo = getHomeInfo();

  if (!homeInfo)
    return (
      <Button mode="text" onPress={logOut}>
        Log out
      </Button>
    );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={{
        // ...styles.container,
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <Header title="Home" showLogo={true} showButtons={true} />
      <GreetingCard homeInfo={homeInfo} userType={userType} />
      <HomeInfoCard homeInfo={homeInfo} userType={userType} />
      <TopCarerView homeInfo={homeInfo} />
      {userType === "owner" ? (
        <OwnerHomeReviewView homeInfo={homeInfo} />
      ) : (
        <CarerHomeReviewView homeInfo={homeInfo} />
      )}
    </ScrollView>
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
      <View style={{ width: "60%" }}>
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
          style={{ borderRadius: 25, width: 180, height: 180 }}
          imageId={carer.pfp}
          defaultImage="carer"
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
      <Card.Content style={{ flex: 1, gap: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignContent: "flex-start",
          }}
        >
          <DynamicAvatar pfp={review.authorIcon} defaultPfp="user" size={30} />
          <Text
            style={{ paddingLeft: 6, flexShrink: 1, maxWidth: 200 }}
            variant="titleSmall"
          >
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
    paddingVertical: 5,
    paddingHorizontal: 25,
    gap: 40,
    overflow: "visible",
  },
  greeting: {
    flexDirection: "row",
    paddingTop: 10,
    paddingHorizontal: "10%",
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
