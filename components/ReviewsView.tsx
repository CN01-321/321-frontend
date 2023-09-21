import { useState } from "react";
import { FlatList, View } from "react-native";
import ShowModalFab from "./ShowModalFab";
import { Card, IconButton, Text } from "react-native-paper";
import { StarRating } from "./StarRating";
import axios from "axios";
import DynamicAvatar from "./DynamicAvatar";
import { CommentsModal } from "./modals/CommentsModal";
import NewReviewModal from "./modals/NewReviewModal";

const icon = require("../assets/icon.png");
const image = require("../assets/splash.png");

export interface Profile {
  _id: string;
  name: string;
  pfp?: string;
}

export interface Review {
  _id: string;
  authorId: string;
  authorName: string;
  authorIcon?: string;
  postedOn: string;
  rating?: number;
  message: string;
  image?: string;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  authorId: string;
  authorName: string;
  authorIcon?: string;
  message: string;
  postedOn: string;
}

interface ProfileReviewsViewProps {
  profile: Profile;
  isSelf?: boolean;
  isPet?: boolean;
  reviews: Review[];
  updateReviews: () => Promise<void>;
}

export default function ReviewsView({
  profile,
  isSelf,
  isPet,
  reviews,
  updateReviews,
}: ProfileReviewsViewProps) {
  const [newReviewVisible, setNewReviewVisible] = useState(false);

  return (
    <>
      <View>
        <FlatList
          data={reviews}
          renderItem={({ item }) => (
            <ReviewCard
              review={item}
              profile={profile}
              isPet={isPet ?? false}
              updateReviews={updateReviews}
            />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 70 }}
        />

        <NewReviewModal
          title="Rate & Review"
          visible={newReviewVisible}
          onDismiss={() => setNewReviewVisible(false)}
          reviewingPet={isPet ?? false}
          profileId={profile._id}
          updateReviews={updateReviews}
        />
      </View>
      {isSelf ? null : (
        <ShowModalFab
          icon="lead-pencil"
          showModal={() => setNewReviewVisible(true)}
        />
      )}
    </>
  );
}

interface ReviewCardProps {
  review: Review;
  profile: Profile;
  isPet: boolean;
  updateReviews: () => Promise<void>;
}

function ReviewCard({
  review,
  profile,
  isPet,
  updateReviews,
}: ReviewCardProps) {
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    const prefix = `/${isPet ? "pets" : "users"}`;
    const url = `${prefix}/${profile._id}/feedback/${review._id}/likes`;
    console.log(url);
    try {
      const { data } = await axios.post(
        `${prefix}/${profile._id}/feedback/${review._id}/likes`
      );

      console.log(url, `liked comment by ${review.authorName}, got `, data);
    } catch (e) {
      console.error(e);
    }
  };

  const submitComment = async (message: string) => {
    console.log("adding comment ", message);
    try {
      const prefix = `/${isPet ? "pets" : "users"}`;
      await axios.post(
        `${prefix}/${profile._id}/feedback/${review._id}/comments`,
        { message }
      );
      await updateReviews();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card>
      {review.image ? <Card.Cover source={image} /> : null}
      <Card.Content>
        <DynamicAvatar pfp={review.authorIcon} defaultPfp={icon} />
        <View>
          <Text variant="titleSmall">{review.authorName}</Text>
          {review.rating ? <StarRating stars={review.rating} /> : null}
          <Text variant="bodySmall">{review.message}</Text>
          <View style={{ flexDirection: "row" }}>
            <IconButton
              icon="thumb-up-outline"
              size={20}
              onPress={handleLike}
            />
            <Text>{review.likes}</Text>
            <IconButton
              icon="comment-outline"
              size={20}
              onPress={() => setShowComments(true)}
            />
            <Text>{review.comments.length}</Text>
          </View>
        </View>
        <CommentsModal
          title="Comments"
          comments={review.comments}
          onComment={submitComment}
          visible={showComments}
          onDismiss={() => setShowComments(false)}
        />
      </Card.Content>
    </Card>
  );
}
