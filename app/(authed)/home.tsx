import { Avatar, Button, Card, Text } from "react-native-paper";
import { View, StyleSheet, FlatList } from "react-native";
import { useAuth } from "../../contexts/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { Review } from "../../components/ReviewsView";
import DynamicCardCover from "../../components/DynamicCardCover";
import DynamicAvatar from "../../components/DynamicAvatar";
import { StarRating } from "../../components/StarRating";

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
  recentReviews: Review[];
  topCarers: TopCarer[];
}

export default function Home() {
  const { getTokenUser, logOut } = useAuth();
  const [homeInfo, setHomeInfo] = useState<HomeInfo>({} as HomeInfo);

  const userType = getTokenUser()?.type;

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      try {
        const { data } = await axios.get<HomeInfo>(`/${userType}s/home`);
        console.log(data);
        if (!ignore) setHomeInfo(data);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => (ignore = true);
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Home" showButtons={true} />
      <View>
        <Text variant="titleSmall">Hi, {homeInfo.name}</Text>
        <Text variant="titleSmall">
          Completed {userType === "owner" ? "Requests" : "Jobs"}{" "}
          {homeInfo.completed}
        </Text>
        <Text variant="bodyMedium">
          Pending {userType === "owner" ? "Requests" : "Jobs"}{" "}
          {homeInfo.pending}
        </Text>
        <Text variant="bodyMedium">
          Current {userType === "owner" ? "Requests" : "Jobs"}{" "}
          {homeInfo.current}
        </Text>

        <Text variant="titleSmall">Top Carers in the Area</Text>
        <FlatList
          horizontal={true}
          data={homeInfo.topCarers}
          renderItem={({ item }) => <TopCarerCard carer={item} />}
          keyExtractor={(item) => item._id}
        />

        {userType === "owner" ? (
          <Text variant="titleSmall">Top Carers Reviews</Text>
        ) : (
          <Text variant="titleSmall">Your Recent Reviews</Text>
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
      </View>
    </View>
  );
}

function TopCarerCard({ carer }: { carer: TopCarer }) {
  return (
    <Card>
      <DynamicCardCover imageId={carer.pfp} defaultImage={icon} />
      <Card.Content>
        <Text variant="titleSmall">{carer.name}</Text>
        <Avatar.Icon icon="star" size={10} />
        <Text variant="bodySmall">
          {carer.rating} ({carer.totalReviews} reviews)
        </Text>
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
  return (
    <Card>
      <Card.Content>
        <DynamicAvatar pfp={review.authorIcon} defaultPfp={icon} />
        <Text variant="titleSmall">{review.authorName}</Text>
        {carer ? (
          <>
            <Text variant="bodySmall">has reviewed</Text>
            <DynamicAvatar pfp={carer.pfp} defaultPfp={icon} />
            <Text variant="titleSmall">{carer.name}</Text>
          </>
        ) : null}
        {review.rating ? <StarRating stars={review.rating} /> : null}
        {/* <Text variant="bodySmall">{review.postedOn.toUTCString()}</Text> */}
        <Text variant="bodyMedium">{review.message}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 40,
    textAlign: "center",
    padding: 40,
  },
  logout: {
    paddingTop: "100%",
  },
});
