import { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Avatar, Button } from "react-native-paper";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { User } from "../types";
import DynamicAvatar from "./DynamicAvatar";
import EditableTextbox from "./EditableTextbox";
import { pickImage, uploadImage } from "../utilities/image";
import axios from "axios";

const icon = require("../assets/icon.png");

type EditProfileFormProp = {
  user: User;
}

type FormData = {
  name: string;
  email: string;
  phone: string;
  location: {
    street: string;
    city: string;
    state: string;
    postcode: string;
    coordinates: [number, number];
  };
  bio: string;
}

const EditProfileForm = ({ user }: EditProfileFormProp) => {
  const router = useRouter();

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      name: user.name || "",
      email: user.email,
      phone: user.phone || "",
      location: {
        street: user.location?.street || "",
        city: user.location?.city || "",
        state: user.location?.state || "",
        postcode: user.location?.postcode || "",
      },
      bio: user.bio || "",
    },
  });

  const [profilePicture, setProfilePicture] = useState<string | undefined>(user.pfp);

  const editProfilePicture = async () => {
    const image = await pickImage();
    
    if (image) {
      setProfilePicture(image);
    }
  }

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.log("Location permission was not granted")
      return;
    }

    const geocodedLocation = await Location.geocodeAsync(
      `${data.location.street} ${data.location.city} ${data.location.state} ${data.location.postcode}`
    );

    console.log(geocodedLocation);

    data.location.coordinates = [
      geocodedLocation[0].longitude,
      geocodedLocation[0].latitude,
    ];

    try {
      user.userType == "owner" ? await axios.put("/owners", data) : await axios.put("/carers", data)
      if (profilePicture) await uploadImage(profilePicture);
    } catch (error) {
      console.log(error);
    }
    
    reset();
    router.back();
  }
  
  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.pfpEdit}>
          {user.pfp ? (
            <DynamicAvatar pfp={user.pfp} defaultPfp={icon} />
          ) : (
            profilePicture ? <Avatar.Image source={{ uri: profilePicture }} size={150} /> : null
          )}
          <Button mode="text" labelStyle={styles.pfpEditDescription} onPress={editProfilePicture}>
            Tap Here to Change Photo
          </Button>
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
          name="location.street"
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
          name="location.city"
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
          name="location.state"
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
          name="location.postcode"
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
        <Button mode="contained" onPress={handleSubmit(onSubmit)}>
          Save Changes
        </Button>
      </View>
    </ScrollView>
  );
}

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
    color: "#777777"
  }
});
 
export default EditProfileForm;