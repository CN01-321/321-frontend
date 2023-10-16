/**
 * @file Shows a list of a reviews for a profile
 * @author George Bull
 */

import { useState } from "react";
import { FlatList, View } from "react-native";
import ShowModalFab from "../ShowModalFab";
import { CommentsModal } from "../modals/CommentsModal";
import NewReviewModal from "../modals/NewReviewModal";
import ReviewCard from "../cards/ReviewCard";
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
  isSelf?: boolean;
  reviews: Review[];
}

export default function ReviewsView({
  isSelf,
  reviews,
}: ProfileReviewsViewProps) {
  const [newReviewVisible, setNewReviewVisible] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [currentReview, setCurrentReview] = useState<Review>();
  const theme = useTheme();

  const showComments = (review: Review) => {
    setCurrentReview(review);
    setCommentsVisible(true);
  };

  return (
    <View style={{ height: "100%", backgroundColor: theme.colors.background }}>
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          renderItem={({ item }) => (
            <ReviewCard
              review={item}
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
          visible={commentsVisible}
          reviewId={currentReview._id}
          onDismiss={() => setCommentsVisible(false)}
        />
      ) : null}
      <NewReviewModal
        title="Rate & Review"
        visible={newReviewVisible}
        onDismiss={() => setNewReviewVisible(false)}
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
