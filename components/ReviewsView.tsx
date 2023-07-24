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
  reviews: Array<Review>;
}

export default function ReviewsView({
  profile,
  isSelf,
  reviews,
}: ProfileReviewsViewProps) {
  const [newReviewVisible, setNewReviewVisible] = useState(false);

  return (
    <View>
      <FlatList
        data={reviews}
        renderItem={({ item }) => <ReviewCard review={item} />}
        keyExtractor={(item) => item._id}
      />

      {isSelf ? null : (
        <ShowModalFab
          icon="lead-pencil"
          showModal={() => setNewReviewVisible(true)}
        />
      )}
      <NewReviewModal
        profile={profile}
        visible={newReviewVisible}
        onDismiss={() => setNewReviewVisible(false)}
      />
    </View>
  );
}

interface ReviewCardProps {
  review: Review;
}

function ReviewCard({ review }: ReviewCardProps) {
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    console.log(`liked comment by ${review.authorName}`);
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
        {review.comments.length > 0 && (
          <CommentsModal
            comments={review.comments}
            visible={showComments}
            onDismiss={() => setShowComments(false)}
          />
        )}
      </Card.Content>
    </Card>
  );
}

interface CommentsModalProps {
  comments: Array<Comment>;
  visible: boolean;
  onDismiss: () => void;
}

function CommentsModal({ comments, visible, onDismiss }: CommentsModalProps) {
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
}

function NewReviewModal({ profile, visible, onDismiss }: NewReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    console.log(
      `submitting rating to ${profile.name} with rating: ${rating} and message "${message}"`
    );
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
        <RatingPicker rating={rating} onRatingChange={(r) => setRating(r)} />
        <TextInput
          mode="outlined"
          value={message}
          label="Write Message"
          onChangeText={(text) => setMessage(text)}
        />
        <Button mode="contained" onPress={handleSubmit}>
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
