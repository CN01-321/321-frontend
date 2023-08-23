import { ScrollView } from "react-native";
import { Avatar, Button, TextInput } from "react-native-paper";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { User } from "../types";

type EditProfileFormProp = {
  user: User;
}

type FormData = {
  name: string;
  email: string;
  phone: string;
  street: string,
  city: string,
  state: string,
  postcode: string,
  bio: string;
}

const EditProfileForm = ({ user }: EditProfileFormProp) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: user.name || "",
      email: user.email,
      phone: user.phone || "",
      street: user.location?.street || "",
      city: user.location?.city || "",
      state: user.location?.state || "",
      postcode: user.location?.postcode || "",
      bio: user.bio || "",
    },
  });

  
  return (
    <ScrollView>
      {user.pfp ? (
        <Avatar.Icon icon="account-circle" size={100} />
      ) : (
        <Avatar.Icon icon="account-circle" size={100} />
      )}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Full Name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Phone Number"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="street"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Street Name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="city"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="City"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="state"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="State"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="postcode"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Postcode"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="bio"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="About Me (Max 200 Characters)"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
    </ScrollView>
  );
}
 
export default EditProfileForm;