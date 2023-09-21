import { StyleSheet, View } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";
import BaseModal, { BaseModalProps } from "./BaseModal";
import { Comment } from "../ReviewsView";
import DynamicAvatar from "../DynamicAvatar";
import { sinceRequested } from "../../utils";
import { useState } from "react";

const icon = require("../../assets/icon.png");

interface CommentsModalProps extends BaseModalProps {
  comments: Comment[];
  onComment: (message: string) => Promise<void>;
}

export function CommentsModal({
  title,
  visible,
  onDismiss,
  comments,
  onComment,
}: CommentsModalProps) {
  const [message, setMessage] = useState<string>();
  const theme = useTheme();
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
            onPress={() => {
              if (message) {
                onComment(message);
                setMessage("");
                onDismiss();
              }
            }}
          />
        }
      />
      {comments
        .sort(
          (c1, c2) =>
            new Date(c2.postedOn).getTime() - new Date(c1.postedOn).getTime()
        )
        .map((c) => (
          <CommentCard key={c.authorId + c.postedOn} comment={c} />
        ))}
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
        <DynamicAvatar pfp={comment.authorIcon} defaultPfp={icon} size={40} />
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
