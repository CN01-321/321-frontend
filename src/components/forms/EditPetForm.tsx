/**
 * @file Component for editing pet profiles
 * @author Matthew Kolega
 */

import { View, StyleSheet } from "react-native";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  Pet,
  PetSize,
  PetType,
  SelectorItem,
  petSelectorSizes,
  petSelectorTypes,
  petStatuses,
} from "../../types/types";
import { Button, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import axios from "axios";
import DynamicAvatar from "../DynamicAvatar";
import { pickImage, uploadImage } from "../../utilities/image";

import PersonIcon from "../../../assets/icons/profile/person.svg";
import { ImagePickerAsset } from "expo-image-picker";
import {
  getPetStatuses,
  getSelectorPetSize,
  getSelectorPetType,
} from "../../utilities/utils";
import RadioSelectorCard from "../cards/RadioSelectorCard";
import CheckboxSelectorCard from "../cards/CheckboxSelectorCard";
import ThemedTextInput from "../ThemedTextInput";
import { useMessageSnackbar } from "../../contexts/messageSnackbar";

interface EditPetFormProp {
  pet: Pet;
}

interface FormData {
  name: string;
  petType: SelectorItem<PetType>;
  petSize: SelectorItem<PetSize>;
  statuses: Map<string, boolean>;
  image?: ImagePickerAsset;
}

export default function EditPetForm({ pet }: EditPetFormProp) {
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      name: pet.name,
      petType: getSelectorPetType(pet.petType),
      petSize: getSelectorPetSize(pet.petSize),
      statuses: getPetStatuses(pet),
    },
  });
  const router = useRouter();
  const theme = useTheme();
  const { pushError, pushMessage } = useMessageSnackbar();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const petData = {
      name: data.name,
      petType: data.petType.key,
      petSize: data.petSize.key,
      isVaccinated: data.statuses.get("isVaccinated") ?? false,
      isFriendly: data.statuses.get("isFriendly") ?? false,
      isNeutered: data.statuses.get("isNeutered") ?? false,
    };
    console.log(petData);
    try {
      await axios.put(`/owners/pets/${pet._id}`, petData);

      if (data.image)
        await uploadImage(`/owners/pets/${pet._id}/pfp`, data.image);

      pushMessage("Successfully updated pet");
    } catch (err) {
      console.error(err);
      pushError("Failed to update pet");
    }
    reset();
    router.back();
  };

  return (
    <View style={styles.form}>
      <View style={styles.pfpEdit}>
        <Controller
          control={control}
          name="image"
          render={({ field: { value, onChange } }) => (
            <>
              {value ? (
                <DynamicAvatar pfp={value} defaultPfp="user" size={120} />
              ) : (
                <DynamicAvatar pfp={pet.pfp} defaultPfp="user" size={120} />
              )}
              <Button
                mode="text"
                labelStyle={styles.pfpEditDescription}
                onPress={async () => onChange(await pickImage())}
              >
                Tap Here to Change Photo
              </Button>
            </>
          )}
        />
      </View>
      <Controller
        control={control}
        name="name"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <ThemedTextInput
              label="Pet Name"
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
          </>
        )}
      />
      <View style={styles.inputArea}>
        <Controller
          control={control}
          name="petType"
          render={({ field: { value, onChange } }) => (
            <RadioSelectorCard
              title="Pet Type"
              icon="dog-side"
              border={true}
              items={petSelectorTypes}
              value={value}
              onItemSelect={onChange}
              keyExtractor={(item) => item.key}
              nameExtractor={(item) => item.name}
            />
          )}
        />
      </View>
      <View style={styles.inputArea}>
        <Controller
          control={control}
          name="petSize"
          render={({ field: { value, onChange } }) => (
            <RadioSelectorCard
              title="Pet Size"
              icon="scale"
              border={true}
              items={petSelectorSizes}
              value={value}
              onItemSelect={onChange}
              keyExtractor={(item) => item.key}
              nameExtractor={(item) => item.name}
            />
          )}
        />
      </View>
      <View style={styles.inputArea}>
        <Controller
          control={control}
          name="statuses"
          render={({ field: { value, onChange } }) => (
            <CheckboxSelectorCard
              title="Pet Status"
              icon="list-status"
              border={true}
              items={petStatuses}
              values={value}
              onItemSelect={onChange}
              keyExtractor={(item) => item.key}
              nameExtractor={(item) => item.name}
            />
          )}
        />
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
    flex: 1,
    paddingTop: 15,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 30,
    backgroundColor: "white",
  },
  pfpEdit: {
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    paddingBottom: 15,
  },
  pfpEditDescription: {
    fontFamily: "Montserrat-Medium",
    color: "#777777",
  },
  inputArea: {
    paddingVertical: 10,
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
