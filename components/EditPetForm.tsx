import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Pet, PetSize, PetType } from "../types";
import EditableTextbox from "./EditableTextbox";
import { Avatar, Text, Checkbox, RadioButton, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import axios from "axios";
import DynamicAvatar from "./DynamicAvatar";
import { pickImage, uploadImage } from "../utilities/image";

const icon = require("../assets/icon.png");

type EditPetFormProp = {
  pet: Pet;
}

type FormData = {
  name: string;
  petType: PetType;
  petSize: PetSize;
  isVaccinated: boolean;
  isFriendly: boolean;
  isNeutered: boolean;
};

const EditPetForm = ({ pet }: EditPetFormProp ) => {
  const router = useRouter();

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
        name: pet.name,
        petType: pet.petType,
        petSize: pet.petSize,
        isVaccinated: pet.isVaccinated,
        isFriendly: pet.isFriendly,
        isNeutered: pet.isNeutered
    }
  });

  const [profilePicture, setProfilePicture] = useState<string | undefined>(pet.pfp);

  const editProfilePicture = async () => {
    const image = await pickImage();
    
    if (image) {
      setProfilePicture(image);
    }
  }

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log(data);
    try {
      await axios.put(`/owner/pets/${pet._id}`, data);
      if (profilePicture != null) await uploadImage(`/owner/pets/${pet._id}/pfp`, profilePicture);
    } catch (error) {
      console.log(error);
    }
    reset();
    router.back();
  };

  return (
    <View style={styles.form}>
      <View style={styles.pfpEdit}>
        {pet.pfp ? (
          <DynamicAvatar pfp={pet.pfp} defaultPfp={icon} />
        ) : (
          profilePicture 
            ? <Avatar.Image source={{ uri: profilePicture }} size={150} /> 
            : <Avatar.Image source={icon} size={150} /> 
        )}
        <Button mode="text" labelStyle={styles.pfpEditDescription} onPress={editProfilePicture}>
          Tap Here to Change Photo
        </Button>
      </View>
      <Controller
        control={control}
        name="name"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <EditableTextbox
            label="Pet Name"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="petType"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <View>
            <RadioButton
              value="Dog"
              status={ value == "dog" ? "checked" : "unchecked"}
              onPress={() => onChange("dog")}
            />
            <RadioButton
              value="Cat"
              status={ value == "cat" ? "checked" : "unchecked"}
              onPress={() => onChange("cat")}
            />
            <RadioButton
              value="Bird"
              status={ value == "bird" ? "checked" : "unchecked"}
              onPress={() => onChange("bird")}
            />
            <RadioButton
              value="Rabbit"
              status={ value == "rabbit" ? "checked" : "unchecked"}
              onPress={() => onChange("rabbit")}
            />
          </View>
        )}
      />
      <Controller
        control={control}
        name="petSize"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <View>
            <RadioButton
              value="Small"
              status={ value == "small" ? "checked" : "unchecked"}
              onPress={() => onChange("small")}
            />
            <RadioButton
              value="Medium"
              status={ value == "medium" ? "checked" : "unchecked"}
              onPress={() => onChange("medium")}
            />
            <RadioButton
              value="Large"
              status={ value == "large" ? "checked" : "unchecked"}
              onPress={() => onChange("large")}
            />
          </View>
        )}
      />
      <Text>Vaccinated</Text>
      <Controller
        control={control}
        name="isVaccinated"
        render={({ field: { onChange, value } }) => (
          <Checkbox
            status={value ? "checked" : "unchecked"}
            onPress={() => onChange(!value)}
          />
        )}
      />
      <Text>Friendly</Text>
      <Controller
        control={control}
        name="isFriendly"
        render={({ field: { onChange, value } }) => (
          <Checkbox
            status={value ? "checked" : "unchecked"}
            onPress={() => onChange(!value)}
          />
        )}
      />
      <Text>Neutered</Text>
      <Controller
        control={control}
        name="isNeutered"
        render={({ field: { onChange, value } }) => (
          <Checkbox
            status={value ? "checked" : "unchecked"}
            onPress={() => onChange(!value)}
          />
        )}
      />
      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        Add Pet
      </Button>
    </View>
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
 
export default EditPetForm;