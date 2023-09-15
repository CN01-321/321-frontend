import { View, ScrollView, StyleSheet } from "react-native";
import { Avatar, Button, List, TextInput, Text } from "react-native-paper";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { User } from "../types/types";
import EditableTextbox from "./EditableTextbox";

type EditProfileFormProp = {
  user: User;
};

type FormData = {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postcode: string;
  bio: string;
};

const EditProfileForm = ({ user }: EditProfileFormProp) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
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
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.pfpEdit}>
          {user.pfp ? (
            <Avatar.Icon icon="account-circle" size={150} />
          ) : (
            <Avatar.Icon icon="account-circle" size={150} />
          )}
          <Text style={styles.pfpEditDescription}>
            Tap Here to Change Photo
          </Text>
        </View>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <EditableTextbox
              label="Full Name"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
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
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <EditableTextbox
              label="Phone Number"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="street"
          render={({ field: { onChange, onBlur, value } }) => (
            <EditableTextbox
              label="Street Name"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, onBlur, value } }) => (
            <EditableTextbox
              label="City"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="state"
          render={({ field: { onChange, onBlur, value } }) => (
            <EditableTextbox
              label="State"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="postcode"
          render={({ field: { onChange, onBlur, value } }) => (
            <EditableTextbox
              label="Postcode"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="bio"
          render={({ field: { onChange, onBlur, value } }) => (
            <EditableTextbox
              label="About Me (Max 200 Characters)"
              value={value}
              multiline={true}
              onBlur={onBlur}
              onChangeText={onChange}
            />
          )}
        />
        <Button mode="contained">Save Changes</Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
    paddingTop: 15,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 30,
  },
  pfpEdit: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    paddingBottom: 15,
  },
  pfpEditDescription: {
    fontFamily: "Montserrat-Medium",
    color: "#777777",
  },
});

export default EditProfileForm;
