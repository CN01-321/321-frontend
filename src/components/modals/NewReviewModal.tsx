/**
 * @file Modal component for creating a new review
 * @author George Bull
 */

import { StyleSheet, View } from "react-native";
import BaseModal, { BaseModalProps } from "./BaseModal";
import DynamicAvatar from "../DynamicAvatar";
import { Button, Text } from "react-native-paper";
import { useMessageSnackbar } from "../../contexts/messageSnackbar";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ThemedTextInput from "../ThemedTextInput";
import ErrorText from "../ErrorText";
import { StarRating } from "../StarRating";
import { useUser } from "../../contexts/user";
import { useProfile } from "../../contexts/profile";

export interface ReviewForm {
  rating?: number;
  message: string;
}

interface NewReviewModalProps extends BaseModalProps {}

export default function NewReviewModal({
  title,
  visible,
  onDismiss,
}: NewReviewModalProps) {
  const { getUser } = useUser();
  const { newReview } = useProfile();
  const { pushError } = useMessageSnackbar();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewForm>();

  const onSubmit: SubmitHandler<ReviewForm> = async (data) => {
    try {
      await newReview(data);
    } catch (err) {
      console.error(err);
      pushError("Could not submit review");
    }

    reset();
    onDismiss();
  };

  return (
    <BaseModal title={title} visible={visible} onDismiss={onDismiss}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingTop: 10,
        }}
      >
        <DynamicAvatar pfp={getUser().pfp} defaultPfp="user" size={100} />
        <Text variant="titleMedium">{getUser().name}</Text>
        <View style={styles.reviewItem}>
          <Controller
            control={control}
            name="rating"
            rules={{ max: 5, min: 0 }}
            render={({ field: { onChange, value } }) => (
              <StarRating
                stars={value ?? 0}
                size={40}
                onRatingChange={onChange}
              />
            )}
          />
        </View>
        <Controller
          control={control}
          name="message"
          rules={{ required: "Please write a review" }}
          render={({ field: { onChange, value } }) => (
            <ThemedTextInput
              label="Write your Review"
              value={value}
              onChangeText={onChange}
              multiline={true}
              style={{
                width: "90%",
              }}
            />
          )}
        />
        <ErrorText>{errors.message?.message}</ErrorText>
        <View style={styles.reviewItem}>
          <Button
            style={{ width: "50%" }}
            mode="contained"
            onPress={handleSubmit(onSubmit)}
          >
            Post Review
          </Button>
        </View>
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  reviewItem: {
    padding: 30,
  },
});
