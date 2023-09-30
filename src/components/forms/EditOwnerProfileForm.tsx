import { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import axios from "axios";
import { pickImage, uploadImage } from "../../utilities/image";
import DynamicAvatar from "../DynamicAvatar";
import { OwnerProfile } from "../../types/types";

import PersonIcon from "../../../assets/icons/profile/person.svg";
import EmailIcon from "../../../assets/icons/profile/email.svg";
import PhoneIcon from "../../../assets/icons/profile/phone.svg";
import StreetIcon from "../../../assets/icons/profile/sign.svg";
import CityIcon from "../../../assets/icons/profile/city.svg";
import StateIcon from "../../../assets/icons/profile/map.svg";
import PostcodeIcon from "../../../assets/icons/profile/mailbox.svg";
import AboutMeIcon from "../../../assets/icons/profile/aboutme.svg";
import { ImagePickerAsset } from "expo-image-picker";
import ThemedTextInput from "../ThemedTextInput";
import ErrorText from "../ErrorText";
import { Href } from "expo-router/build/link/href";

type EditOwnerProfileFormProp = {
  owner: OwnerProfile;
  navigateOnComplete?: Href;
};

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
};

const EditOwnerProfileForm = ({
  owner,
  navigateOnComplete,
}: EditOwnerProfileFormProp) => {
  const router = useRouter();
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: owner.name || "",
      email: owner.email,
      phone: owner.phone || "",
      location: {
        street: owner.location?.street || "",
        city: owner.location?.city || "",
        state: owner.location?.state || "",
        postcode: owner.location?.postcode || "",
      },
      bio: owner.bio || "",
    },
  });

  const [profilePicture, setProfilePicture] = useState<ImagePickerAsset>();

  const editProfilePicture = async () => {
    const image = await pickImage();

    if (image) {
      setProfilePicture(image);
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.log("Location permission was not granted");
      return;
    }

    const geocodedLocation = await Location.geocodeAsync(
      `${data.location.street} ${data.location.city} ${data.location.state} ${data.location.postcode}`
    );

    data.location.coordinates = [
      geocodedLocation[0].longitude,
      geocodedLocation[0].latitude,
    ];

    const submittedData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: {
        coordinates: data.location.coordinates,
        street: data.location.street,
        city: data.location.city,
        state: data.location.state,
        postcode: data.location.postcode,
      },
      bio: data.bio,
    };

    try {
      await axios.put("/owners", submittedData);
      if (profilePicture != undefined)
        await uploadImage("/users/pfp", profilePicture);
    } catch (error) {
      console.log(error);
    }

    reset();

    if (navigateOnComplete) {
      router.replace(navigateOnComplete);
    } else {
      router.back();
    }
  };

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <View style={styles.form}>
        <View style={styles.pfpEdit}>
          {profilePicture ? (
            <DynamicAvatar pfp={profilePicture} defaultPfp="user" size={120} />
          ) : (
            <DynamicAvatar pfp={owner.pfp} defaultPfp="user" size={120} />
          )}
          <Button
            mode="text"
            labelStyle={styles.pfpEditDescription}
            onPress={editProfilePicture}
          >
            Tap Here to Change Photo
          </Button>
        </View>
        <Controller
          control={control}
          rules={{ required: "A name is required" }}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedTextInput
              label="Full Name"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              icon={() => (
                <PersonIcon
                  height={25}
                  width={25}
                  fill={theme.colors.primary}
                />
              )}
            />
          )}
        />
        <ErrorText>{errors.name?.message}</ErrorText>
        <Controller
          control={control}
          name="email"
          rules={{ required: "An email is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedTextInput
              label="Email"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              icon={() => (
                <EmailIcon height={25} width={25} fill={theme.colors.primary} />
              )}
            />
          )}
        />
        <ErrorText>{errors.email?.message}</ErrorText>
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedTextInput
              label="Phone Number"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              icon={() => (
                <PhoneIcon height={25} width={25} fill={theme.colors.primary} />
              )}
            />
          )}
        />
        <Controller
          control={control}
          name="location.street"
          rules={{ required: "Street name is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedTextInput
              label="Street Name"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              icon={() => (
                <StreetIcon
                  height={25}
                  width={25}
                  fill={theme.colors.primary}
                />
              )}
            />
          )}
        />
        <ErrorText>{errors.location?.street?.message}</ErrorText>
        <Controller
          control={control}
          name="location.city"
          rules={{ required: "City is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedTextInput
              label="City"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              icon={() => (
                <CityIcon height={25} width={25} fill={theme.colors.primary} />
              )}
            />
          )}
        />
        <ErrorText>{errors.location?.city?.message}</ErrorText>
        <Controller
          control={control}
          name="location.state"
          rules={{ required: "State is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedTextInput
              label="State"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              icon={() => (
                <StateIcon height={25} width={25} fill={theme.colors.primary} />
              )}
            />
          )}
        />
        <ErrorText>{errors.location?.state?.message}</ErrorText>
        <Controller
          control={control}
          name="location.postcode"
          rules={{ required: "Postcode is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedTextInput
              label="Postcode"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              icon={() => (
                <PostcodeIcon
                  height={25}
                  width={25}
                  fill={theme.colors.primary}
                />
              )}
            />
          )}
        />
        <ErrorText>{errors.location?.postcode?.message}</ErrorText>
        <Controller
          control={control}
          name="bio"
          render={({ field: { onChange, onBlur, value } }) => (
            <ThemedTextInput
              label="About Me (Max 200 Characters)"
              value={value}
              multiline={true}
              onBlur={onBlur}
              onChangeText={onChange}
              icon={() => (
                <AboutMeIcon
                  height={25}
                  width={25}
                  fill={theme.colors.primary}
                />
              )}
            />
          )}
        />
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            labelStyle={styles.button}
            style={{ width: "65%" }}
            onPress={handleSubmit(onSubmit)}
          >
            Save Changes
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
    gap: 20,
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
  buttonContainer: {
    marginTop: 30,
    display: "flex",
    alignItems: "center",
  },
  button: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
  },
});

export default EditOwnerProfileForm;
