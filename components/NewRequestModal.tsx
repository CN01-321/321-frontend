import { ScrollView, View, Text } from "react-native";
import { Button, Checkbox, Modal, Portal, TextInput, useTheme } from "react-native-paper";
import { useEffect, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker"

interface NewRequestModalProps {
  visible: boolean,
  onDismiss: () => void,
}

interface Pet {
  id: string
  name: string,
  type: string,
}

const petData: Array<Pet> = [
  {
    id: "0", 
    name: "Pet 1",
    type: "Dog"
  },
  {
    id: "1", 
    name: "Pet 2",
    type: "Dog"
  },
  {
    id: "2", 
    name: "Pet 3",
    type: "Cat"
  },
  {
    id: "3", 
    name: "Pet 4",
    type: "Cat"
  }
];

export default function NewRequestModal({visible, onDismiss}: NewRequestModalProps) {
  const theme = useTheme();
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [pets, setPets] = useState<Array<Pet>>([]);
  const [selectedPets, setSelectedPets] = useState<Map<string, boolean>>(new Map())

  useEffect(() => {
    let petsMap: Map<string, boolean> = new Map();
    petData.forEach(pet => petsMap.set(pet.id, false))

    setSelectedPets(petsMap);
    // setPets(petData);
  }, []);

  const handleConfirm = (date: Date) => {
    setDate(date);
    setShowPicker(false);
  }

  const selectPet = (id: string) => {
    const select = !selectedPets.get(id);
    setSelectedPets(selectedPets.set(id, select));
  }

  const handleSubmit = () => {
    console.log("submitted");
    onDismiss();
  }

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} style={{ backgroundColor: "white"}}>
        <ScrollView>
          <Button
            mode="contained"
            onPress={() => setShowPicker(true)}
          >
            Set Date
          </Button>
          <DateTimePickerModal 
            isVisible={showPicker}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={() => setShowPicker(false)}
          />
          <TextInput 
            label="Additional information"
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
            multiline={true}
          />
          <View>
            <Text>Select Pets</Text>
            {pets.map(pet => <Checkbox 
                status={selectedPets.get(pet.id) ? "checked" : "unchecked"}
                onPress={() => selectPet(pet.id)}
              />
            )}
          </View>
          <Button 
            mode="contained"
            onPress={handleSubmit}
          >
            Request
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
}