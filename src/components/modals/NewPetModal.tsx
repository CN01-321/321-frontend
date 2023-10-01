import { Button, Text } from "react-native-paper";
import BaseModal, { BaseModalProps } from "./BaseModal";
import ThemedTextInput from "../ThemedTextInput";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { View, Image, StyleSheet } from "react-native";
import {
  PetSize,
  PetType,
  SelectorItem,
  petSelectorSizes,
  petSelectorTypes,
  petStatuses,
} from "../../types/types";
import ErrorText from "../ErrorText";
import RadioSelectorCard from "../cards/RadioSelectorCard";
import CheckboxSelectorCard from "../cards/CheckboxSelectorCard";
import * as ImagePicker from "expo-image-picker";
import { useMessageSnackbar } from "../../contexts/messageSnackbar";
import { pickImage } from "../../utilities/image";
import { usePets } from "../../contexts/pets";

const icon = require("../../../assets/icon.png");

interface NewPetModalProps extends BaseModalProps {}

interface NewPetForm {
  name: string;
  petType: SelectorItem<PetType>;
  petSize: SelectorItem<PetSize>;
  statuses: Map<string, boolean>;
  image?: ImagePicker.ImagePickerAsset;
}

export default function NewPetModal({
  title,
  visible,
  onDismiss,
}: NewPetModalProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewPetForm>({
    defaultValues: {
      name: "",
      petType: petSelectorTypes[0],
      petSize: petSelectorSizes[0],
      statuses: new Map(),
    },
  });
  const { pushError } = useMessageSnackbar();
  const { newPet } = usePets();

  const onSubmit: SubmitHandler<NewPetForm> = async (formData) => {
    const petData = {
      name: formData.name,
      petType: formData.petType.key,
      petSize: formData.petSize.key,
      isVaccinated: formData.statuses.get("isVaccinated") ?? false,
      isFriendly: formData.statuses.get("isFriendly") ?? false,
      isNeutered: formData.statuses.get("isNeutered") ?? false,
    };

    console.log(petData);

    try {
      newPet(petData, formData.image);
      onDismiss();
      reset();
    } catch (err) {
      console.error(err);
      pushError("Could not add new pet");
    }
  };

  return (
    <BaseModal title={title} visible={visible} onDismiss={onDismiss}>
      <Text variant="titleMedium">
        Welcoming the newest member of your furry family
      </Text>
      <Text variant="bodySmall">Add a new pet profile</Text>

      <View style={styles.inputArea}>
        <Controller
          control={control}
          rules={{ required: "A pet name is required" }}
          name="name"
          render={({ field: { value, onChange } }) => (
            <ThemedTextInput
              label="Pet Name"
              value={value}
              onChangeText={onChange}
              icon="shield-account-outline"
            />
          )}
        />
        <ErrorText>{errors.name?.message}</ErrorText>
      </View>

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
              onItemSelect={(event) => {
                console.log(event);
                onChange(event);
              }}
              keyExtractor={(item) => item.key}
              nameExtractor={(item) => item.name}
            />
          )}
        />
      </View>

      <View style={styles.inputArea}>
        <Text variant="titleMedium">Snap a Picture!</Text>
        <Text variant="bodySmall">
          Add a picture of your pet to share with the PetCarer community
        </Text>
        <Controller
          control={control}
          name="image"
          render={({ field: { value, onChange } }) => (
            <View style={{ margin: 10 }}>
              <Image
                source={value ? value : icon}
                style={{
                  borderRadius: 14,
                  alignSelf: "center",
                  height: 400,
                  width: 300,
                }}
              />
              <View>
                <Button
                  mode="outlined"
                  onPress={async () => onChange(await pickImage())}
                  style={{ marginTop: 5 }}
                >
                  Upload Image
                </Button>
              </View>
            </View>
          )}
        />
      </View>

      <View style={styles.inputArea}>
        <Button mode="contained" onPress={handleSubmit(onSubmit)}>
          Finish
        </Button>
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  inputArea: {
    marginVertical: 10,
  },
});
