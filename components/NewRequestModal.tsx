import { ScrollView, View } from "react-native";
import {
  Avatar,
  Text,
  Button,
  Checkbox,
  Modal,
  Portal,
  TextInput,
  useTheme,
} from "react-native-paper";
import { useEffect, useState } from "react";
import { DatePickerButton } from "./DatePickerButton";
import { CarerResult } from "./CarerResultsView";

interface NewRequestModalProps {
  carerResult?: CarerResult | null;
  visible: boolean;
  onDismiss: () => void;
}

interface Pet {
  id: string;
  name: string;
  type: string;
}

interface SelectedPet extends Pet {
  checked: boolean;
}

const petData: Array<Pet> = [
  {
    id: "0",
    name: "Pet 1",
    type: "Dog",
  },
  {
    id: "1",
    name: "Pet 2",
    type: "Dog",
  },
  {
    id: "2",
    name: "Pet 3",
    type: "Cat",
  },
  {
    id: "3",
    name: "Pet 4",
    type: "Cat",
  },
];

export default function NewRequestModal({
  carerResult,
  visible,
  onDismiss,
}: NewRequestModalProps) {
  const [date, setDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [pets, setPets] = useState<Map<string, SelectedPet>>(new Map());

  useEffect(() => {
    // maps an array of pets into an array of selected pets, and turns that array
    // into a map of <pet.id, pet>
    setPets(
      new Map(
        petData
          .map((pet) => {
            return { ...pet, checked: false };
          })
          .map((pet) => [pet.id, pet])
      )
    );
  }, []);

  const handleConfirm = (date: Date) => {
    console.log(`new date is ${date}`);
    setDate(date);
    setShowPicker(false);
  };

  const selectPet = (id: string) => {
    let pet = pets.get(id);
    if (!pet) {
      console.error("pet not found");
      return;
    }

    setPets(new Map(pets.set(id, { ...pet, checked: !pet.checked })));
  };

  const handleSubmit = () => {
    console.log(
      carerResult ? `submitted to ${carerResult.name}` : "submitted broadly"
    );
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        style={{ backgroundColor: "white" }}
      >
        <ScrollView>
          <Text variant="titleMedium">
            {carerResult ? `Request to ${carerResult.name}` : "New Request"}
          </Text>
          <DatePickerButton
            label="request date"
            date={date}
            updateDate={(d: Date) => setDate(d)}
          />
          <TextInput
            label="Additional information"
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
            multiline={true}
          />
          <View>
            <Text variant="titleMedium">Select Pets</Text>
            {[...pets].map(([id, pet]) => (
              <PetCheckBox
                key={pet.id}
                pet={pet}
                onPress={() => selectPet(pet.id)}
              />
            ))}
          </View>
          <Button mode="contained" onPress={handleSubmit}>
            Request
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

interface PetCheckBoxProps {
  pet: SelectedPet;
  onPress: () => void;
}

function PetCheckBox({ pet, onPress }: PetCheckBoxProps) {
  return (
    <View style={{ flexDirection: "row", padding: 20 }}>
      <Checkbox
        key={pet.id}
        status={pet.checked ? "checked" : "unchecked"}
        onPress={onPress}
      />
      <Avatar.Icon icon={"dog"} size={40} style={{ padding: 10 }} />
      <Text style={{ padding: 10 }}>{pet.name}</Text>
      <Text style={{ padding: 10 }}>{pet.type}</Text>
    </View>
  );
}
