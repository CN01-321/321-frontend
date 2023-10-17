/**
 * @file Modal component for showing and writing comments
 * @author George Bull
 */

import { StyleSheet, View } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";
import BaseModal, { BaseModalProps } from "./BaseModal";
import { Comment } from "../views/ReviewsView";
import DynamicAvatar from "../DynamicAvatar";
import { sinceRequested } from "../../utilities/utils";
import { useState } from "react";
import { useProfile } from "../../contexts/profile";

interface CommentsModalProps extends BaseModalProps {
  reviewId: string;
  comments: Comment[];
}

export function CommentsModal({
  title,
  visible,
  onDismiss,
  reviewId,
  comments,
}: CommentsModalProps) {
  const [message, setMessage] = useState<string>();
  const theme = useTheme();
  const { newComment } = useProfile();

  // sort comments by date decending
  comments = comments.sort(
    (c1, c2) =>
      new Date(c2.postedOn).getTime() - new Date(c1.postedOn).getTime()
  );

  const handleComment = async () => {
    if (!message) return;

    await newComment(reviewId, message);
    setMessage("");
  };

  return (
    <BaseModal title={title} visible={visible} onDismiss={onDismiss}>
      <TextInput
        placeholder="Write a comment"
        style={styles.commentInput}
        value={message}
        onChangeText={setMessage}
        left={
          <TextInput.Icon icon="lead-pencil" iconColor={theme.colors.primary} />
        }
        right={
          <TextInput.Icon
            icon="send-outline"
            iconColor={theme.colors.primary}
            onPress={handleComment}
          />
        }
      />
      {comments.length > 0 ? (
        comments.map((c) => (
          <CommentCard key={c.authorId + c.postedOn} comment={c} />
        ))
      ) : (
        <Text variant="titleLarge" style={{ padding: 20 }}>
          No Comments
        </Text>
      )}
    </BaseModal>
  );
}

interface CommentCardProps {
  comment: Comment;
}
function CommentCard({ comment }: CommentCardProps) {
  return (
    <View style={styles.commandCardContainer}>
      <View style={styles.commandCardInfo}>
        <DynamicAvatar pfp={comment.authorIcon} defaultPfp="user" size={40} />
        <View style={{ paddingHorizontal: 15 }}>
          <Text variant="titleSmall">{comment.authorName}</Text>
          <Text variant="bodySmall">{comment.message}</Text>
        </View>
      </View>
      <Text variant="bodySmall">
        {sinceRequested(new Date(comment.postedOn))}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  commandCardContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    marginVertical: 5,
  },
  commandCardInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  commentInput: {
    backgroundColor: "white",
  },
});
