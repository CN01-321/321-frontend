import {
  Avatar,
  Button,
  Card,
  Divider,
  Text,
  useTheme,
} from "react-native-paper";
import { View, StyleSheet, FlatList, SafeAreaView } from "react-native";
import { useAuth } from "../../contexts/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { Review } from "../../components/ReviewsView";
import DynamicCardCover from "../../components/DynamicCardCover";
import DynamicAvatar from "../../components/DynamicAvatar";
import { StarRating } from "../../components/StarRating";
import { toDDMMYYYY } from "../../utils";

const icon = require("../../assets/icon.png");

interface TopCarer {
  _id: string;
  name: string;
  pfp: string;
  rating: string;
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

  const userType = getTokenUser()?.type;

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      try {
        const { data } = await axios.get<HomeInfo>(`/${userType}s/home`);

        if (!ignore) setHomeInfo(data);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => (ignore = true);
  }, []);

  return (
    <SafeAreaView
      style={(styles.container, { backgroundColor: theme.colors.background })}
    >
      <Header title="Home" showButtons={true} />
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <View style={{ flexDirection: "column", padding: 10 }}>
          <Text variant="titleMedium">Hello {homeInfo.name},</Text>
          <Text variant="bodySmall">Your total pending requests are:</Text>
        </View>
        <View
          style={{ padding: 20, paddingLeft: "10%", alignContent: "center" }}
        >
          <Text>{homeInfo.pending} Requests</Text>
        </View>
      </View>

      <HomeInfoCard homeInfo={homeInfo} />

      <Text variant="titleMedium">Top Carers in the Area</Text>
      <FlatList
        horizontal={true}
        data={homeInfo.topCarers}
        renderItem={({ item }) => <TopCarerCard carer={item} />}
        keyExtractor={(item) => item._id}
      />

      {userType === "owner" ? (
        <Text variant="titleMedium">Top Carers Reviews</Text>
      ) : (
        <Text variant="titleMedium">Your Recent Reviews</Text>
      )}

      {userType === "owner" ? (
        <FlatList
          horizontal={true}
          data={homeInfo.topCarers}
          renderItem={({ item }) =>
            item.recentReview ? (
              <TopReviewCard review={item.recentReview} carer={item} />
            ) : null
          }
          keyExtractor={(item) => item._id}
        />
      ) : (
        <FlatList
          horizontal={true}
          data={homeInfo.recentReviews}
          renderItem={({ item }) => <TopReviewCard review={item} />}
          keyExtractor={(item) => item._id}
        />
      )}

      <Button mode="outlined" onPress={logOut}>
        Log out
      </Button>
    </SafeAreaView>
  );
}

function HomeInfoCard({ homeInfo }: { homeInfo: HomeInfo }) {
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
          <Text style={styles.homeInfoText}>Completed Requests</Text>
        </View>
        <VericalDivider />
        <View style={styles.homeInfoSegment}>
          <Text variant="headlineMedium" style={styles.homeInfoText}>
            {homeInfo.pending}
          </Text>
          <Text style={styles.homeInfoText}>Pending Requests</Text>
        </View>
        <VericalDivider />
        <View style={styles.homeInfoSegment}>
          <Text variant="headlineMedium" style={styles.homeInfoText}>
            {homeInfo.current}
          </Text>
          <Text style={styles.homeInfoText}>Current Requests</Text>
        </View>
      </Card.Content>
    </Card>
  );
}

function TopCarerCard({ carer }: { carer: TopCarer }) {
  return (
    <Card style={{ margin: 2 }}>
      <DynamicCardCover
        style={{ width: 150, height: 150 }}
        imageId={carer.pfp}
        defaultImage={icon}
      />
      <Card.Content>
        <Text variant="titleSmall">{carer.name}</Text>
        <View
          style={{
            marginBottom: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar.Icon icon="star" size={10} style={{ margin: 5 }} />
          <Text variant="bodySmall">
            {carer.rating} ({carer.totalReviews} reviews)
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

function TopReviewCard({
  review,
  carer,
}: {
  review: Review;
  carer?: TopCarer;
}) {
  console.log(review);
  return (
    <Card style={{ width: 300, margin: 2 }}>
      <Card.Content>
        <View style={{ flexDirection: "row" }}>
          {carer ? (
            <View>
              <Text>
                <DynamicAvatar
                  pfp={review.authorIcon}
                  defaultPfp={icon}
                  size={30}
                />
                <Text variant="titleSmall">
                  {review.authorName}{" "}
                  <Text variant="bodyMedium">has reviewed</Text>
                </Text>
              </Text>
              <Text>
                <DynamicAvatar pfp={carer.pfp} defaultPfp={icon} size={30} />
                <Text variant="titleSmall">{carer.name}</Text>
              </Text>
            </View>
          ) : (
            <Text>
              <DynamicAvatar
                pfp={review.authorIcon}
                defaultPfp={icon}
                size={30}
              />
              <Text variant="titleSmall">{review.authorName}</Text>
            </Text>
          )}
          <Text variant="bodySmall">
            {toDDMMYYYY(new Date(review.postedOn))}
          </Text>
        </View>
        {review.rating ? <StarRating stars={review.rating} /> : null}
        <Text variant="bodyMedium">{review.message}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 10,
  },
  title: {
    fontSize: 40,
    textAlign: "center",
    padding: 40,
  },
  logout: {
    paddingTop: "100%",
  },
  homeInfoSegment: {
    width: 100,
  },
  homeInfoText: {
    color: "white",
    textAlign: "center",
  },
});
