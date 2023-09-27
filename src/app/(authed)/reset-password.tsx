import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import ThemedTextInput from "../../components/ThemedTextInput";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ErrorText from "../../components/ErrorText";
import axios from "axios";
import { useMessageSnackbar } from "../../contexts/messageSnackbar";

interface ResetPasswordForm {
  current: string;
  newPassword: string;
  confirmPassword: string;
}

export default function PasswordReset() {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ResetPasswordForm>();
  const { pushMessage, pushError } = useMessageSnackbar();

  const onSubmit: SubmitHandler<ResetPasswordForm> = async (data) => {
    console.log(errors);

    try {
      await axios.post("/users/password", {
        current: data.current,
        password: data.newPassword,
      });
      pushMessage("Successfully updated password");
    } catch (err) {
      console.error(err);
      pushError("Could not update password");
    }
  };

  return (
    <View>
      <Text variant="titleLarge">Reset Password</Text>
      <Controller
        control={control}
        name="current"
        rules={{
          required: "Please enter your current password",
        }}
        render={({ field: { value, onChange } }) => (
          <ThemedTextInput
            label="Current Password"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            icon="lock-outline"
          />
        )}
      />
      {errors.current?.message ? (
        <ErrorText errMsg={errors.current.message} />
      ) : null}
      <Controller
        control={control}
        name="newPassword"
        rules={{
          required: "Please enter your new password",
        }}
        render={({ field: { value, onChange } }) => (
          <ThemedTextInput
            label="New Password"
            value={value}
            onChangeText={onChange}
            icon="lock-outline"
            secureTextEntry
          />
        )}
      />
      {errors.newPassword?.message ? (
        <ErrorText errMsg={errors.newPassword.message} />
      ) : null}
      <Controller
        control={control}
        rules={{
          required: "Please confirm your new password",
          validate: (confirm) => {
            const newPassword = getValues("newPassword");
            if (!newPassword || !confirm) {
              return true;
            }

            return confirm === newPassword ? true : "Passwords do not match";
          },
        }}
        name="confirmPassword"
        render={({ field: { value, onChange } }) => (
          <ThemedTextInput
            label="Confirm Password"
            value={value}
            onChangeText={onChange}
            icon="lock-outline"
            secureTextEntry
          />
        )}
      />
      {errors.confirmPassword?.message ? (
        <ErrorText errMsg={errors.confirmPassword.message} />
      ) : null}
      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        Reset
      </Button>
    </View>
  );
}
