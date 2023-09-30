import { useState } from "react";
import { FlatList, View } from "react-native";
import ShowModalFab from "../ShowModalFab";
import axios from "axios";
import { CommentsModal } from "../modals/CommentsModal";
import NewReviewModal from "../modals/NewReviewModal";
import ReviewCard from "../cards/ReviewCard";
import { useMessageSnackbar } from "../../contexts/messageSnackbar";
import { Text, useTheme } from "react-native-paper";

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
  liked: boolean;
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
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [currentReview, setCurrentReview] = useState<Review>();
  const { pushError } = useMessageSnackbar();
  const theme = useTheme();

  const handleLike = async (reviewId: string) => {
    const prefix = `/${isPet ? "pets" : "users"}`;
    try {
      await axios.post(`${prefix}/${profile._id}/feedback/${reviewId}/likes`);
      await updateReviews();
    } catch (err) {
      console.error(err);
      pushError("Could not like message");
    }
  };

  const showComments = (review: Review) => {
    setCurrentReview(review);
    setCommentsVisible(true);
  };

  const submitComment = async (message: string) => {
    console.log("adding comment ", message);
    try {
      const prefix = `/${isPet ? "pets" : "users"}`;
      await axios.post(
        `${prefix}/${profile._id}/feedback/${currentReview?._id}/comments`,
        { message }
      );
      await updateReviews();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={{ height: "100%", backgroundColor: theme.colors.background }}>
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          renderItem={({ item }) => (
            <ReviewCard
              review={item}
              onLike={() => handleLike(item._id)}
              onShowComments={() => showComments(item)}
            />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 70 }}
        />
      ) : (
        <Text variant="titleLarge" style={{ textAlign: "center", padding: 40 }}>
          No Reviews
        </Text>
      )}
      {currentReview ? (
        <CommentsModal
          title="Comments"
          comments={currentReview.comments}
          onComment={submitComment}
          visible={commentsVisible}
          onDismiss={() => setCommentsVisible(false)}
        />
      ) : null}
      <NewReviewModal
        title="Rate & Review"
        visible={newReviewVisible}
        onDismiss={() => setNewReviewVisible(false)}
        reviewingPet={isPet ?? false}
        profileId={profile._id}
        updateReviews={updateReviews}
      />
      {isSelf ? null : (
        <ShowModalFab
          icon="lead-pencil"
          showModal={() => setNewReviewVisible(true)}
        />
      )}
    </View>
  );
}
