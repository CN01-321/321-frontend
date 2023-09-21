import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Pet, PetSize, PetType } from "../types/types";
import EditableTextbox from "./EditableTextbox";
import { Avatar, Text, Checkbox, RadioButton, Button, useTheme, Divider } from "react-native-paper";
import { useRouter } from "expo-router";
import axios from "axios";
import DynamicAvatar from "./DynamicAvatar";
import { pickImage, uploadImage } from "../utilities/image";

import PersonIcon from "../assets/icons/profile/person.svg";
import PawIcon from "../assets/icons/pet/paw.svg";
import ScalesIcon from "../assets/icons/pet/scale.svg";
import StatusIcon from "../assets/icons/pet/status.svg";

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
  console.log(pet);
  const router = useRouter();
  const theme = useTheme();

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
      await axios.put(`/owners/pets/${pet._id}`, data);
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
            icon={() => <PersonIcon height={25} width={25} fill={theme.colors.primary} />}
          />
        )}
      />
      <View style={[ styles.optionBox, { borderColor: theme.colors.primary }]}>
        <View style={styles.optionBoxHeadingContainer}>
          <PawIcon height={25} width={25} fill={theme.colors.primary} />
          <Text style={styles.optionBoxHeading}>Pet Type</Text>
        </View>
        <View style={styles.selectionsContainer}> 
          <Controller
            control={control}
            name="petType"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <View>
                <View style={styles.selectionOption}>
                  <Text style={styles.selectionOptionLabel}>Dog</Text>
                  <RadioButton
                    value="Dog"
                    status={ value == "dog" ? "checked" : "unchecked"}
                    onPress={() => onChange("dog")}
                    uncheckedColor={theme.colors.primary}
                  />
                </View>
                <Divider style={{ backgroundColor: theme.colors.primary }}/>
                <View style={styles.selectionOption}>
                  <Text style={styles.selectionOptionLabel}>Cat</Text>
                  <RadioButton
                    value="Cat"
                    status={ value == "cat" ? "checked" : "unchecked"}
                    onPress={() => onChange("cat")}
                    uncheckedColor={theme.colors.primary}
                  />
                </View>
                <Divider style={{ backgroundColor: theme.colors.primary }}/>
                <View style={styles.selectionOption}>
                  <Text style={styles.selectionOptionLabel}>Bird</Text>
                  <RadioButton
                    value="Bird"
                    status={ value == "bird" ? "checked" : "unchecked"}
                    onPress={() => onChange("bird")}
                    uncheckedColor={theme.colors.primary}
                  />
                </View>
                <Divider style={{ backgroundColor: theme.colors.primary }}/>
                <View style={styles.selectionOption}>
                  <Text style={styles.selectionOptionLabel}>Rabbit</Text>
                  <RadioButton
                    value="Rabbit"
                    status={ value == "rabbit" ? "checked" : "unchecked"}
                    onPress={() => onChange("rabbit")}
                    uncheckedColor={theme.colors.primary}
                  />
                </View>
              </View>
            )}
          />
        </View>
      </View>
      <View style={[ styles.optionBox, { borderColor: theme.colors.primary }]}>
        <View style={styles.optionBoxHeadingContainer}>
          <ScalesIcon height={25} width={25} fill={theme.colors.primary} />
          <Text style={styles.optionBoxHeading}>Pet Size</Text>
        </View>
        <View style={styles.selectionsContainer}>
          <Controller
            control={control}
            name="petSize"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <View>
                <View style={styles.selectionOption}>
                  <Text style={styles.selectionOptionLabel}>Small</Text>
                  <RadioButton
                    value="Small"
                    status={ value == "small" ? "checked" : "unchecked"}
                    onPress={() => onChange("small")}
                    uncheckedColor={theme.colors.primary}
                  />
                </View>
                <Divider style={{ backgroundColor: theme.colors.primary }} />
                <View style={styles.selectionOption}>
                  <Text style={styles.selectionOptionLabel}>Medium</Text>
                  <RadioButton
                    value="Medium"
                    status={ value == "medium" ? "checked" : "unchecked"}
                    onPress={() => onChange("medium")}
                    uncheckedColor={theme.colors.primary}
                  />
                </View>
                <Divider style={{ backgroundColor: theme.colors.primary }} />
                <View style={styles.selectionOption}>
                  <Text style={styles.selectionOptionLabel}>Large</Text>
                  <RadioButton
                    value="Large"
                    status={ value == "large" ? "checked" : "unchecked"}
                    onPress={() => onChange("large")}
                    uncheckedColor={theme.colors.primary}
                  />
                </View>
            </View>
          )}
        />
        </View>
      </View>
      <View style={[ styles.optionBox, { borderColor: theme.colors.primary }]}>
        <View style={styles.optionBoxHeadingContainer}>
          <StatusIcon height={25} width={25} fill={theme.colors.primary} />
          <Text style={styles.optionBoxHeading}>Pet Status</Text>
        </View>
        <View style={styles.selectionsContainer}>
          <View style={styles.selectionOption}>
            <Text style={styles.selectionOptionLabel}>Vaccinated</Text>
            <Controller
              control={control}
              name="isVaccinated"
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  status={value ? "checked" : "unchecked"}
                  onPress={() => onChange(!value)}
                  uncheckedColor={theme.colors.primary}
                />
              )}
            />
          </View>
          <Divider style={{ backgroundColor: theme.colors.primary }} />
          <View style={styles.selectionOption}>
            <Text style={styles.selectionOptionLabel}>Friendly</Text>
            <Controller
              control={control}
              name="isFriendly"
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  status={value ? "checked" : "unchecked"}
                  onPress={() => onChange(!value)}
                  uncheckedColor={theme.colors.primary}
                />
              )}
            />
          </View>
          <Divider style={{ backgroundColor: theme.colors.primary }} />
          <View style={styles.selectionOption}>
            <Text style={styles.selectionOptionLabel}>Neutered</Text>
            <Controller
              control={control}
              name="isNeutered"
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  status={value ? "checked" : "unchecked"}
                  onPress={() => onChange(!value)}
                  uncheckedColor={theme.colors.primary}
                />
              )}
            />
          </View>
        </View>
      </View>
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
  optionBox: {
    border: "solid",
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
  },
  optionBoxHeadingContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  optionBoxHeading: {
    fontFamily: "Montserrat-SemiBold",
  },
  selectionsContainer: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  selectionOption: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  selectionOptionLabel: {
    fontFamily: "Montserrat-Medium",
    color: "#505050"
  }
});
 
export default EditPetForm;