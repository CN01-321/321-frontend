import { Avatar, Button, Checkbox, Text, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useMessageSnackbar } from "../contexts/messageSnackbar";
import BaseModal from "./modals/BaseModal";

type AddPetFormData = {
  name: string;
  petType: string;
  petSize: string;
  isVaccinated: boolean;
  isFriendly: boolean;
  isNeutered: boolean;
};

type AddPetModalProps = {
  visible: boolean;
  onDismiss: () => void;
};

const AddPetModal = ({ visible, onDismiss }: AddPetModalProps) => {
  const { control, handleSubmit, reset } = useForm<AddPetFormData>();
  const { pushMessage, pushError } = useMessageSnackbar();

  const onSubmit: SubmitHandler<AddPetFormData> = async (data) => {
    console.log(data);
    try {
      await axios.post("/owners/pets", data);
      pushMessage("Successfully added new pet");
    } catch (error) {
      console.log(error);
      pushError("Error adding new pet");
    }
    reset();
    onDismiss();
  };

  const pickProfilePicture = async () => {
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  };

  return (
    <BaseModal title="New Pet" visible={visible} onDismiss={onDismiss}>
      <Avatar.Text label="P" onTouchStart={pickProfilePicture}></Avatar.Text>
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="name"
      />
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Type"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="petType"
      />
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Size"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="petSize"
      />
      <Text>Vaccinated</Text>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <Checkbox
            status={value ? "checked" : "unchecked"}
            onPress={() => onChange(!value)}
          />
        )}
        name="isVaccinated"
      />
      <Text>Friendly</Text>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <Checkbox
            status={value ? "checked" : "unchecked"}
            onPress={() => onChange(!value)}
          />
        )}
        name="isFriendly"
      />
      <Text>Neutered</Text>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <Checkbox
            status={value ? "checked" : "unchecked"}
            onPress={() => onChange(!value)}
          />
        )}
        name="isNeutered"
      />
      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        Add Pet
      </Button>
    </BaseModal>
  );
};

export default AddPetModal;
