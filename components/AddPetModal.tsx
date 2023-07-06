import { useState } from "react";
import { ScrollView } from "react-native";
import { Avatar, Button, Checkbox, Modal, Portal, Text, TextInput } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';

type AddPetModalProps = {
  visible: boolean;
  onDismiss: () => void;
}

const AddPetModal = ({ visible, onDismiss }: AddPetModalProps) => {
  const [checkboxState, setCheckboxState] = useState({
    vaccinatedCheckbox: false,
    friendlyCheckbox: false,
    neuteredCheckbox: false,
  });

  const pickProfilePicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  }

  const handleSubmit = () => {
    console.log("Pet has been added");
    onDismiss();
  }

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} style={{ backgroundColor: "white" }}>
        <ScrollView>
          <Avatar.Text label="P" onTouchStart={pickProfilePicture}></Avatar.Text>
          <TextInput 
            label="Name"
          />
          <TextInput 
            label="Type"
          />
          <TextInput 
            label="Size"
          />
          <Text>Vaccinated</Text>
          <Checkbox 
            status={checkboxState.vaccinatedCheckbox ? 'checked' : 'unchecked'}
            onPress={() => setCheckboxState({...checkboxState, vaccinatedCheckbox: !checkboxState.vaccinatedCheckbox})}
          />
          <Text>Friendly</Text>
          <Checkbox 
            status={checkboxState.friendlyCheckbox ? 'checked' : 'unchecked'}
            onPress={() => setCheckboxState({...checkboxState, friendlyCheckbox: !checkboxState.friendlyCheckbox})}
          />
          <Text>Neutered</Text>
          <Checkbox
            status={checkboxState.neuteredCheckbox ? 'checked' : 'unchecked'}
            onPress={() => setCheckboxState({...checkboxState, neuteredCheckbox: !checkboxState.neuteredCheckbox})}
          />
          <Button mode="contained" onPress={handleSubmit}>
            Add Pet
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
}
 
export default AddPetModal;