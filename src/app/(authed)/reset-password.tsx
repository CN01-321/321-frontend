import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import ThemedTextInput from "../../components/ThemedTextInput";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ErrorText from "../../components/ErrorText";
import axios from "axios";
import { useMessageSnackbar } from "../../contexts/messageSnackbar";

import ResetPasswordSVG from "../../../assets/reset-password.svg";
import { verifyPassword } from "../../utilities/utils";

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
    reset,
  } = useForm<ResetPasswordForm>();
  const { pushMessage, pushError } = useMessageSnackbar();

  const onSubmit: SubmitHandler<ResetPasswordForm> = async (data) => {
    try {
      await axios.post("/users/password", {
        current: data.current,
        password: data.newPassword,
      });

      pushMessage("Successfully updated password");
      reset();
    } catch (err) {
      console.error(err);
      pushError("Could not update password");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="position"
      style={{ flex: 1, backgroundColor: "white", padding: 10 }}
    >
      <View
        style={{ padding: 40, justifyContent: "center", alignItems: "center" }}
      >
        <ResetPasswordSVG />
      </View>
      <Text
        variant="titleLarge"
        style={{ textAlign: "center", padding: 10, fontSize: 35 }}
      >
        Reset Password
      </Text>
      <Controller
        control={control}
        name="current"
        rules={{
          required: "Please enter your current password",
        }}
        render={({ field: { value, onChange } }) => (
          <View style={styles.inputArea}>
            <Text variant="bodyMedium" style={{ textAlign: "center" }}>
              Enter your current password for verification
            </Text>
            <ThemedTextInput
              label="Current Password"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              icon="lock-outline"
              defaultValue=""
            />
          </View>
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
          validate: verifyPassword,
        }}
        render={({ field: { value, onChange } }) => (
          <View style={styles.inputArea}>
            <ThemedTextInput
              label="New Password"
              value={value}
              onChangeText={onChange}
              icon="lock-outline"
              secureTextEntry
              defaultValue=""
            />
          </View>
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
          <View style={styles.inputArea}>
            <ThemedTextInput
              label="Confirm Password"
              value={value}
              onChangeText={onChange}
              icon="lock-outline"
              secureTextEntry
              defaultValue=""
            />
          </View>
        )}
      />
      {errors.confirmPassword?.message ? (
        <ErrorText errMsg={errors.confirmPassword.message} />
      ) : null}
      <View style={styles.inputArea}>
        <Button mode="contained" onPress={handleSubmit(onSubmit)}>
          Reset
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputArea: {
    marginHorizontal: 10,
    paddingVertical: 5,
  },
});
