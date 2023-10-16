/**
 * @file Card component to show a review
 * @author George Bull
 */

import { Button, Card, Divider, Text } from "react-native-paper";
import { Review } from "../views/ReviewsView";
import DynamicAvatar from "../DynamicAvatar";
import { StyleSheet, View } from "react-native";
import { toDDMMYYYY } from "../../utilities/utils";
import { StarRating } from "../StarRating";
import { useProfile } from "../../contexts/profile";

interface ReivewCardProps {
  review: Review;
  onShowComments: () => void;
}

export default function ReviewCard({
  review,
  onShowComments,
}: ReivewCardProps) {
  const { likeReview } = useProfile();

  const handleLike = async () => {
    await likeReview(review._id);
  };

  return (
    <Card style={{ margin: 5 }}>
      <Card.Content>
        <View style={styles.titleContainer}>
          <View style={styles.titleName}>
            <DynamicAvatar
              pfp={review.authorIcon}
              defaultPfp="user"
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
            <Button mode="text" icon="thumb-up-outline" onPress={handleLike}>
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
