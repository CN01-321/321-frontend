import { View } from "react-native";
import { Button, Title } from "react-native-paper";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useAuth } from "../../contexts/auth";
import { CARER_COLOUR, OWNER_COLOUR, UserType } from "../../types/types";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../components/Header";
import EditableTextbox from "../../components/EditableTextbox";

type GetToken = {
  token: string;
};

type FormData = {
  email: string;
  password: string;
}

export default function Login() {
  const { userType } = useLocalSearchParams<{ userType: UserType }>();
  const { logIn } = useAuth();
  const router = useRouter();

  const colour = userType === "owner" ? OWNER_COLOUR : CARER_COLOUR;

  const { control, handleSubmit } = useForm<FormData>({});

  const login: SubmitHandler<FormData> = async (formData) => {
    try {
      const { data } = await axios.post<GetToken>("/login", formData);
      console.log("new token in login.tsx", data.token);
      await logIn(data.token);
      console.log(`logged in with: ${formData.email} and ${formData.password}`);
      router.replace("/home");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Header title="Log In" />
      <Title>Log In</Title>
      <Controller
        control={control}
        name="email"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <EditableTextbox
            label="Email"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <EditableTextbox
            label="Password"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            secureTextEntry
          />
        )}
      />
      <Button
        mode="contained"
        onPress={handleSubmit(login)}
        theme={{ colors: { primary: colour } }}
      >
        Login
      </Button>
    </View>
  );
}
