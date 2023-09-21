import { StyleSheet, View } from "react-native";
import BaseModal, { BaseModalProps } from "./BaseModal";
import DynamicAvatar from "../DynamicAvatar";
import { useEffect, useState } from "react";
import { User } from "../../types/types";
import { Button, Text } from "react-native-paper";
import axios from "axios";
import { useAuth } from "../../contexts/auth";
import { useMessageSnackbar } from "../../contexts/messageSnackbar";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ThemedTextInput from "../ThemedTextInput";
import ErrorText from "../ErrorText";
import { StarRating } from "../StarRating";

const icon = require("../../assets/icon.png");

interface ReviewForm {
  rating?: number;
  message: string;
}

interface NewReviewModalProps extends BaseModalProps {
  reviewingPet: boolean;
  profileId: string;
  updateReviews: () => Promise<void>;
}

export default function NewReviewModal({
  title,
  visible,
  onDismiss,
  reviewingPet,
  profileId,
  updateReviews,
}: NewReviewModalProps) {
  const [reviewer, setReviewer] = useState<User>();
  const { getTokenUser } = useAuth();
  const { pushMessage, pushError } = useMessageSnackbar();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewForm>();

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      try {
        const { data } = await axios.get<User>(`/${getTokenUser()?.type}s`);
        if (!ignore) setReviewer(data);
      } catch (err) {
        console.error(err);
        pushError("Could not fetch information for reviewing");
      }
    })();

    return () => (ignore = true);
  }, []);

  const onSubmit: SubmitHandler<ReviewForm> = async (data) => {
    console.log(data);

    try {
      const prefix = `/${reviewingPet ? "pets" : "users"}`;
      await axios.post(`${prefix}/${profileId}/feedback`, data);
      console.log(
        `submitting rating to ${profileId} with rating: ${data.rating} and message "${data.message}"`
      );
      pushMessage("Successfully submitted review!");
      await updateReviews();
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
        <DynamicAvatar pfp={reviewer?.pfp} defaultPfp={icon} size={100} />
        <Text variant="titleMedium">{reviewer?.name}</Text>
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
        {errors.message?.message ? (
          <ErrorText errMsg={errors.message.message} />
        ) : null}
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
