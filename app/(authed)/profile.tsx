import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  IconButton,
  Modal,
  Portal,
  SegmentedButtons,
  Text,
  TextInput,
} from "react-native-paper";
import { StarRating } from "../../components/StarRating";

const icon = require("../../assets/icon.png");
const image = require("../../assets/splash.png");

interface Review {
  reviewId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerIcon?: string;
  date: Date;
  rating?: number;
  message: string;
  image?: string;
  likes: number;
  comments: Array<Comment>;
}

interface Comment {
  commentId: string;
  commenterId: string;
  commenterName: string;
  commenterIcon?: string;
  date: Date;
  message: string;
  comments: Array<Comment>;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  pfp?: string;
  reviews: Array<Review>;
}

const userData: User = {
  id: "0",
  name: "Firstname Lastname",
  email: "email@email.com",
  phone: "0412345678",
  reviews: [
    {
      reviewId: "0",
      reviewerId: "0",
      reviewerIcon: "iconPath",
      reviewerName: "Reviewer 1",
      date: new Date(),
      message: "nice pets",
      image: "imagePath",
      likes: 0,
      comments: [],
    },
    {
      reviewId: "1",
      reviewerId: "1",
      reviewerName: "Reviewer 2",
      date: new Date(),
      rating: 2,
      message: "bad pets",
      likes: 5,
      comments: [
        {
          commentId: "0",
          commenterId: "0",
          commenterName: "Commenter 1",
          date: new Date(),
          message: "hot take",
          comments: [],
        },
        {
          commentId: "1",
          commenterId: "1",
          commenterName: "Commenter 2",
          date: new Date(),
          message: "i agree",
          comments: [],
        },
      ],
    },
  ],
};

type SegmentViewValue = "profile" | "reviews";

export default function Profile() {
  const { userId } = useLocalSearchParams<{ userId?: string }>();
  const [currentView, setCurrentView] = useState<SegmentViewValue>("profile");
  const [user, setUser] = useState<User>({
    id: "",
    name: "",
    email: "",
    phone: "",
    reviews: [],
  });
  const router = useRouter();

  useEffect(() => {
    userId ? setUser(userData) : setUser(userData);
  }, []);

  const handleLike = (reviewId: string) => {
    const review = user.reviews.find((r) => r.reviewId === reviewId);
    console.log(`liked comment by ${review?.reviewerName}`);
  };

  return (
    <View>
      <SegmentedButtons
        value={currentView}
        onValueChange={(value) => {
          console.log(value);
          setCurrentView(value as SegmentViewValue);
        }}
        buttons={[
          {
            value: "profile",
            icon: "account",
            label: "Profile",
          },
          {
            value: "reviews",
            icon: "comment-outline",
            label: "Reviews",
          },
        ]}
      />
      {currentView === "profile" ? (
        <ProfileInfoView user={user} />
      ) : (
        <ProfileReviewsView reviews={user.reviews} handleLike={handleLike} />
      )}
      {/* <ProfileReviewsView reviews={user.reviews} handleLike={handleLike} /> */}
    </View>
  );
}

interface ProfileInfoViewProps {
  user: User;
}

function ProfileInfoView({ user }: ProfileInfoViewProps) {
  return (
    <View>
      {user.pfp ? (
        // TODO replace this with actual profile picture
        <Avatar.Icon icon="account-circle" size={100} />
      ) : (
        <Avatar.Icon icon="account-circle" size={100} />
      )}
      <Text>Profile</Text>
      <TextInput
        label="Name"
        mode="outlined"
        value={user.name}
        editable={false}
      />
      <TextInput
        label="Email"
        mode="outlined"
        value={user.email}
        editable={false}
      />
      <TextInput
        label="Phone"
        mode="outlined"
        value={user.phone}
        editable={false}
      />
    </View>
  );
}

interface ProfileReviewsViewProps {
  reviews: Array<Review>;
  handleLike: (reviewId: string) => void;
}

function ProfileReviewsView({ reviews, handleLike }: ProfileReviewsViewProps) {
  return (
    <View>
      <FlatList
        data={reviews}
        renderItem={({ item }) => (
          <ReviewCard review={item} handleLike={handleLike} />
        )}
        keyExtractor={(item) => item.reviewerId}
      />
    </View>
  );
}

interface ReviewCardProps {
  review: Review;
  handleLike: (reviewId: string) => void;
}

function ReviewCard({ review, handleLike }: ReviewCardProps) {
  const [showComments, setShowComments] = useState(false);

  return (
    <Card>
      {review.image ? <Card.Cover source={image} /> : null}
      <Card.Content>
        {review.reviewerIcon ? (
          // TODO change to getting avatar from backend
          <Avatar.Image size={24} source={icon} />
        ) : (
          <Avatar.Image size={24} source={icon} />
        )}
        <View>
          <Text variant="titleSmall">{review.reviewerName}</Text>
          {review.rating ? <StarRating stars={review.rating} /> : null}
          <Text variant="bodySmall">{review.message}</Text>
          <IconButton
            icon="thumb-up-outline"
            size={20}
            onPress={() => handleLike(review.reviewerId)}
          />
          <IconButton
            icon="comment-outline"
            size={20}
            onPress={() => setShowComments(true)}
          />
        </View>
        <CommentsModal
          comments={review.comments}
          visible={showComments}
          onDismiss={() => setShowComments(false)}
        />
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
            keyExtractor={(item) => item.commentId}
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
        {comment.commenterIcon ? (
          // TODO change to getting avatar from backend
          <Avatar.Image size={24} source={icon} />
        ) : (
          <Avatar.Image size={24} source={icon} />
        )}
        <View>
          <Text variant="titleSmall">{comment.commenterName}</Text>
          <Text variant="bodySmall">Posted: {comment.date.toUTCString()}</Text>
          <Text variant="bodySmall">{comment.message}</Text>
        </View>
      </Card.Content>
    </Card>
  );
}
