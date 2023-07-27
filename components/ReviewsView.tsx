import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import ShowModalFab from "./ShowModalFab";
import {
  Avatar,
  Button,
  Card,
  IconButton,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { StarRating } from "./StarRating";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";

const icon = require("../assets/icon.png");
const image = require("../assets/splash.png");

export interface Profile {
  _id: string;
  name: string;
}

export interface Review {
  _id: string;
  authorId: string;
  authorName: string;
  authorIcon?: string;
  postedOn: Date;
  rating?: number;
  message: string;
  image?: string;
  likes: number;
  comments: Array<Comment>;
}

export interface Comment {
  authorId: string;
  authorName: string;
  authorIcon?: string;
  message: string;
  postedOn: Date;
}

interface ProfileReviewsViewProps {
  profile: Profile;
  isSelf?: boolean;
  isPet?: boolean;
  reviews: Array<Review>;
}

export default function ReviewsView({
  profile,
  isSelf,
  isPet,
  reviews,
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
}

function ReviewCard({ review, profile, isPet }: ReviewCardProps) {
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

  return (
    <Card>
      {review.image ? <Card.Cover source={image} /> : null}
      <Card.Content>
        {review.authorIcon ? (
          // TODO change to getting avatar from backend
          <Avatar.Image size={24} source={icon} />
        ) : (
          <Avatar.Image size={24} source={icon} />
        )}
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
        {/* prevent an empty modal from showing up if there are no comments */}
        {/* {review.comments.length > 0 && ( */}
        <CommentsModal
          profile={profile}
          review={review}
          comments={review.comments}
          visible={showComments}
          onDismiss={() => setShowComments(false)}
          isPet={isPet}
        />
        {/* )} */}
      </Card.Content>
    </Card>
  );
}

interface CommentsModalProps {
  profile: Profile;
  review: Review;
  comments: Array<Comment>;
  visible: boolean;
  onDismiss: () => void;
  isPet: boolean;
}

function CommentsModal({
  profile,
  review,
  comments,
  visible,
  onDismiss,
  isPet,
}: CommentsModalProps) {
  const [comment, setComment] = useState<string | undefined>();

  const handleComment = async () => {
    console.log("adding comment ", comment);
    try {
      const prefix = `/${isPet ? "pets" : "users"}`;
      await axios.post(
        `${prefix}/${profile._id}/feedback/${review._id}/comments`
      );
    } catch (e) {
      console.error(e);
    }
    setComment(undefined);
    onDismiss();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss}>
        <View>
          <FlatList
            data={comments}
            renderItem={({ item }) => <CommentCard comment={item} />}
            // using index is fine here as arrays are always ordered the same way
            keyExtractor={(_, index) => String(index)}
          />
        </View>
        <TextInput
          mode="flat"
          label="Comment"
          value={comment}
          onChangeText={(text) => setComment(text)}
          left={<Avatar.Image source={icon} />}
          right={
            comment && (
              <TextInput.Icon icon="send-outline" onPress={handleComment} />
            )
          }
        />
      </Modal>
    </Portal>
  );
}

interface CommentCardProps {
  comment: Comment;
}

function CommentCard({ comment }: CommentCardProps) {
  return (
    <Card>
      <Card.Content>
        {comment.authorIcon ? (
          // TODO change to getting avatar from backend
          <Avatar.Image size={24} source={icon} />
        ) : (
          <Avatar.Image size={24} source={icon} />
        )}
        <View>
          <Text variant="titleSmall">{comment.authorIcon}</Text>
          <Text variant="bodySmall">
            Posted: {comment.postedOn.toUTCString()}
          </Text>
          <Text variant="bodySmall">{comment.message}</Text>
        </View>
      </Card.Content>
    </Card>
  );
}

interface NewReviewModalProps {
  profile: Profile;
  visible: boolean;
  onDismiss: () => void;
  isPet: boolean;
}

interface NewReviewForm {
  rating: number;
  message: string;
}

function NewReviewModal({
  profile,
  visible,
  onDismiss,
  isPet,
}: NewReviewModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewReviewForm>();

  const onSubmit: SubmitHandler<NewReviewForm> = async (data) => {
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
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        style={{ backgroundColor: "white" }}
      >
        <Text variant="titleMedium">Rate & Review</Text>
        <Avatar.Image source={icon} size={24} />
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
      </Modal>
    </Portal>
  );
}

interface RatingPickerProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

function RatingPicker({ rating, onRatingChange }: RatingPickerProps) {
  const renderStars = () => {
    let stars = [];
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
