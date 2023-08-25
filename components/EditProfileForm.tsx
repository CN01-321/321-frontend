import { View, ScrollView, StyleSheet } from "react-native";
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

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // const geocodedLocation = await Location.geocodeAsync(`${data.street} ${data.city} ${data.state} ${data.postcode}`);
    // data.coords = [geocodedLocation[0].latitude,  geocodedLocation[0].longitude];
    // try {
    //   await axios.post("/owners/pets", data);
    // } catch (error) {
    //   console.log(error);
    // }
    // reset();
  }

  
  return (
    <ScrollView>
      <View>
        {user.pfp ? (
          <Avatar.Icon icon="account-circle" size={100} />
        ) : (
          <Avatar.Icon icon="account-circle" size={100} />
        )}
      </View>
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
            multiline={true}
          />
        )}
      />
      <Button mode="contained">
        Save Changes
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

});
 
export default EditProfileForm;