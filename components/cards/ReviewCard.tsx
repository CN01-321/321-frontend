import { Button, Card, Divider, Text } from "react-native-paper";
import { Review } from "../ReviewsView";
import DynamicAvatar from "../DynamicAvatar";
import { StyleSheet, View } from "react-native";
import { toDDMMYYYY } from "../../utils";
import { StarRating } from "../StarRating";

const icon = require("../../assets/icon.png");

interface ReivewCardProps {
  review: Review;
  onLike: () => void;
  onShowComments: () => void;
}

export default function ReviewCard({
  review,
  onLike,
  onShowComments,
}: ReivewCardProps) {
  return (
    <Card style={{ margin: 5 }}>
      <Card.Content>
        <View style={styles.titleContainer}>
          <View style={styles.titleName}>
            <DynamicAvatar
              pfp={review.authorIcon}
              defaultPfp={icon}
              size={30}
            />
            <Text variant="titleSmall">{review.authorName}</Text>
          </View>
          <Text variant="bodySmall">
            {toDDMMYYYY(new Date(review.postedOn))}
          </Text>
        </View>
        <View style={styles.ratingArea}>
          {review.rating ? (
            <StarRating stars={review.rating} size={15} />
          ) : null}
        </View>
        <View style={styles.messageArea}>
          <Text variant="bodySmall">{review.message}</Text>
        </View>
        <Divider />
        <View style={styles.actionsContainer}>
          {review.liked ? (
            <Button mode="text" icon="thumb-up">
              {review.likes} Liked
            </Button>
          ) : (
            <Button mode="text" icon="thumb-up-outline" onPress={onLike}>
              {review.likes} Like
            </Button>
          )}
          <Button mode="text" icon="comment-outline" onPress={onShowComments}>
            Comments
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleName: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  actionsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  ratingArea: {
    paddingVertical: 5,
  },
  messageArea: {
    paddingVertical: 10,
  },
});
