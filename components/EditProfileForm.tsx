import { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Checkbox, Avatar, Button } from "react-native-paper";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Owner, Carer } from "../types";
import DynamicAvatar from "./DynamicAvatar";
import EditableTextbox from "./EditableTextbox";
import { pickImage, uploadImage } from "../utilities/image";
import axios from "axios";

const icon = require("../assets/icon.png");

type EditProfileFormProp = {
  user: Owner | Carer;
}

interface FormData {
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
  preferredTravelDistance: string;
  hourlyRate: string;
  willServiceBirds: boolean; 
  willServiceCats: boolean; 
  willServiceDogs: boolean; 
  willServiceRabbits: boolean; 
  willServiceSmall: boolean; 
  willServiceMedium: boolean; 
  willServiceLarge: boolean;
}

const EditProfileForm = ({ user }: EditProfileFormProp) => {
  const router = useRouter();

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: user.userType == "owner" ? {
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
    } : {
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
      preferredTravelDistance: (user as Carer).preferredTravelDistance.toString() || "",
      hourlyRate: (user as Carer).hourlyRate.toString() || "",
      willServiceBirds: (user as Carer).preferredPetTypes.includes("bird"),
      willServiceCats: (user as Carer).preferredPetTypes.includes("cat"),
      willServiceDogs: (user as Carer).preferredPetTypes.includes("dog"), 
      willServiceRabbits: (user as Carer).preferredPetTypes.includes("rabbit"), 
      willServiceSmall: (user as Carer).preferredPetSizes.includes("small"),
      willServiceMedium: (user as Carer).preferredPetSizes.includes("medium"), 
      willServiceLarge: (user as Carer).preferredPetSizes.includes("large"),
    }
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

    let submittedData;
    if (user.userType == "owner") {
      submittedData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: {
          street: data.location.street,
          city: data.location.city,
          state: data.location.state,
          postcode: data.location.postcode,
        },
        bio: data.bio,
      }
    } else {
      const preferredPetTypes = [];
      if (data.willServiceBirds) preferredPetTypes.push("bird");
      if (data.willServiceCats) preferredPetTypes.push("cat");
      if (data.willServiceDogs) preferredPetTypes.push("dog");
      if (data.willServiceRabbits) preferredPetTypes.push("rabbit");

      const preferredPetSizes = [];
      if (data.willServiceSmall) preferredPetSizes.push("small");
      if (data.willServiceMedium) preferredPetSizes.push("medium");
      if (data.willServiceLarge) preferredPetSizes.push("large");

      submittedData = {
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
        preferredTravelDistance: parseInt(data.preferredTravelDistance),
        hourlyRate: parseInt(data.hourlyRate),
        preferredPetTypes: preferredPetTypes,
        preferredPetSizes: preferredPetSizes,
      }
    }

    try {
      user.userType == "owner" ? await axios.put("/owners", submittedData) : await axios.put("/carers", submittedData)
      if (profilePicture != undefined) await uploadImage(profilePicture);
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
        {
          user.userType == "carer"
            ? 
              <View>
                <Controller
                  control={control}
                  name="preferredTravelDistance"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <EditableTextbox
                      label="Maximum Travel Distance"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="hourlyRate"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <EditableTextbox
                      label="Hourly Rate"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                    />
                  )}
                />
                <Text variant="titleMedium">Types of Pets to Service</Text>
                <Text>Birds</Text>
                <Controller
                  control={control}
                  name="willServiceBirds"
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      status={value ? "checked" : "unchecked"}
                      onPress={() => onChange(!value)}
                    />
                  )}
                />
                <Text>Cats</Text>
                <Controller
                  control={control}
                  name="willServiceCats"
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      status={value ? "checked" : "unchecked"}
                      onPress={() => onChange(!value)}
                    />
                  )}
                />
                <Text>Dogs</Text>
                <Controller
                  control={control}
                  name="willServiceDogs"
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      status={value ? "checked" : "unchecked"}
                      onPress={() => onChange(!value)}
                    />
                  )}
                />
                <Text>Rabbits</Text>
                <Controller
                  control={control}
                  name="willServiceRabbits"
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      status={value ? "checked" : "unchecked"}
                      onPress={() => onChange(!value)}
                    />
                  )}
                />
                <Text variant="titleMedium">Size of Pets to Service</Text>
                <Text>Small</Text>
                <Controller
                  control={control}
                  name="willServiceSmall"
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      status={value ? "checked" : "unchecked"}
                      onPress={() => onChange(!value)}
                    />
                  )}
                />
                <Text>Medium</Text>
                <Controller
                  control={control}
                  name="willServiceMedium"
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      status={value ? "checked" : "unchecked"}
                      onPress={() => onChange(!value)}
                    />
                  )}
                />
                <Text>Large</Text>
                <Controller
                  control={control}
                  name="willServiceLarge"
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      status={value ? "checked" : "unchecked"}
                      onPress={() => onChange(!value)}
                    />
                  )}
                />
              </View>
            : null
        }
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