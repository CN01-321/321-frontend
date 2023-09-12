import { ScrollView } from "react-native";
import {
  Avatar,
  Button,
  Checkbox,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import axios from "axios";

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

  const onSubmit: SubmitHandler<AddPetFormData> = async (data) => {
    console.log(data);
    try {
      await axios.post("/owners/pets", data);
    } catch (error) {
      console.log(error);
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
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        style={{ backgroundColor: "white" }}
      >
        <ScrollView>
          <Avatar.Text
            label="P"
            onTouchStart={pickProfilePicture}
          ></Avatar.Text>
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
        </ScrollView>
      </Modal>
    </Portal>
  );
};

export default AddPetModal;
