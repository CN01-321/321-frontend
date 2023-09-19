import { useState } from "react";
import { FlatList, View } from "react-native";
import ShowModalFab from "./ShowModalFab";
import { Button, Card, IconButton, Text, TextInput } from "react-native-paper";
import { StarRating } from "./StarRating";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import DynamicAvatar from "./DynamicAvatar";
import BaseModal from "./modals/BaseModal";
import { CommentsModal } from "./modals/CommentsModal";

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
          profile={profile}
          visible={newReviewVisible}
          onDismiss={() => setNewReviewVisible(false)}
          isPet={isPet ?? false}
        />
      </View>
      {isSelf ? null : (
        <ShowModalFab
          icon="lead-pencil"
          showModal={() => setNewReviewVisible(true)}
          // TODO replace this with safe area values
          style={{ bottom: 50 }}
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

// interface CommentsModalProps {
//   profile: Profile;
//   review: Review;
//   comments: Comment[];
//   visible: boolean;
//   onDismiss: () => void;
//   isPet: boolean;
//   updateReviews: () => Promise<void>;
// }

// function CommentsModal({
//   profile,
//   review,
//   comments,
//   visible,
//   onDismiss,
//   isPet,
//   updateReviews,
// }: CommentsModalProps) {
//   const [comment, setComment] = useState<string | undefined>();

//   const handleComment = async () => {
//     console.log("adding comment ", comment);
//     try {
//       const prefix = `/${isPet ? "pets" : "users"}`;
//       await axios.post(
//         `${prefix}/${profile._id}/feedback/${review._id}/comments`,
//         { message: comment }
//       );
//       await updateReviews();
//     } catch (e) {
//       console.error(e);
//     }
//     setComment(undefined);
//     onDismiss();
//   };

//   return (
//     <Portal>
//       <Modal visible={visible} onDismiss={onDismiss}>
//         <View>
//           <FlatList
//             data={comments}
//             renderItem={({ item }) => <CommentCard comment={item} />}
//             // using index is fine here as arrays are always ordered the same way
//             keyExtractor={(_, index) => String(index)}
//           />
//         </View>
//         <TextInput
//           mode="flat"
//           label="Comment"
//           value={comment}
//           onChangeText={(text) => setComment(text)}
//           left={<Avatar.Image source={icon} />}
//           right={
//             comment ? (
//               <TextInput.Icon icon="send-outline" onPress={handleComment} />
//             ) : null
//           }
//         />
//       </Modal>
//     </Portal>
//   );
// }

// interface CommentCardProps {
//   comment: Comment;
// }

// function CommentCard({ comment }: CommentCardProps) {
//   return (
//     <Card>
//       <Card.Content>
//         <DynamicAvatar pfp={comment.authorIcon} defaultPfp={icon} />
//         <View>
//           <Text variant="titleSmall">{comment.authorIcon}</Text>
//           <Text variant="bodySmall">
//             Posted: {toDDMMYYYY(new Date(comment.postedOn))}
//           </Text>
//           <Text variant="bodySmall">{comment.message}</Text>
//         </View>
//       </Card.Content>
//     </Card>
//   );
// }

interface NewReviewModalProps {
  profile: Profile;
  visible: boolean;
  onDismiss: () => void;
  isPet: boolean;
}

interface NewReviewFormData {
  rating: number;
  message: string;
}

function NewReviewModal({
  profile,
  visible,
  onDismiss,
  isPet,
}: NewReviewModalProps) {
  const { control, handleSubmit, reset } = useForm<NewReviewFormData>();

  const onSubmit: SubmitHandler<NewReviewFormData> = async (data) => {
    console.log(data);

    try {
      const prefix = `/${isPet ? "pets" : "users"}`;
      await axios.post(`${prefix}/${profile._id}/feedback`, data);
      console.log(
        `submitting rating to ${profile.name} with rating: ${data.rating} and message "${data.message}"`
      );
    } catch (e) {
      console.error(e);
    }

    reset();
    onDismiss();
  };

  return (
    <BaseModal title="Rate & Review" visible={visible} onDismiss={onDismiss}>
      <Text variant="titleMedium">Rate & Review</Text>
      <DynamicAvatar pfp={profile.pfp} defaultPfp={icon} />
      <Text>{profile.name}</Text>
      <Controller
        control={control}
        rules={{ max: 5, min: 0 }}
        render={({ field: { onChange, value } }) => (
          <RatingPicker rating={value} onRatingChange={onChange} />
        )}
        name="rating"
      />
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="outlined"
            value={value}
            onBlur={onBlur}
            label="Write Message"
            onChangeText={onChange}
          />
        )}
        name="message"
      />
      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        Submit
      </Button>
    </BaseModal>
  );
}

interface RatingPickerProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

function RatingPicker({ rating, onRatingChange }: RatingPickerProps) {
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <IconButton
          key={i}
          icon={rating > i ? "star" : "star-outline"}
          onPress={() => onRatingChange(i + 1)}
        />
      );
    }
    return stars;
  };

  return <View style={{ flexDirection: "row" }}>{renderStars()}</View>;
}
