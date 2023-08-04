import { ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Text,
  Button,
  Checkbox,
  Modal,
  Portal,
  TextInput,
} from "react-native-paper";
import { useEffect, useState } from "react";
import { DatePickerButton } from "./DatePickerButton";
import { CarerResult } from "./CarerResultsView";
import axios from "axios";
import { Pet } from "../types";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { resolveScheme } from "expo-linking";

interface NewRequestModalProps {
  carerResult?: CarerResult | null;
  visible: boolean;
  updateRequests?: () => void;
  onDismiss: () => void;
}

interface NewRequestForm {
  carer?: string;
  pets: string[];
  message?: string;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
}

export default function NewRequestModal({
  carerResult,
  visible,
  updateRequests,
  onDismiss,
}: NewRequestModalProps) {
  const [pets, setPets] = useState<Pet[]>([]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewRequestForm>();

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      try {
        const { data } = await axios.get<Pet[]>("/owners/pets");
        if (!ignore) {
          setPets(data);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => (ignore = true);
  }, []);

  // reset the form whenever the form gets dissmissed
  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [visible]);

  const onSubmit: SubmitHandler<NewRequestForm> = async (data) => {
    console.log("request data is ", data);

    try {
      await axios.post("/owners/requests", data);

      // update the new list if updateRequests is not undefined
      updateRequests && updateRequests();
    } catch (e) {
      console.error(e);
    }

    reset();
    onDismiss();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss}>
        <ScrollView style={styles.container}>
          <Text variant="titleMedium">
            {carerResult ? `Request to ${carerResult.name}` : "New Request"}
          </Text>
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <DatePickerButton
                label="Start date"
                date={value}
                updateDate={onChange}
              />
            )}
            name="dateRange.startDate"
          />
          {errors.dateRange?.startDate && (
            <Text>Please choose a start date</Text>
          )}
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <DatePickerButton
                label="End date"
                date={value}
                updateDate={onChange}
              />
            )}
            name="dateRange.endDate"
          />
          {errors.dateRange?.endDate && <Text>Please choose an end date</Text>}
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Additional information"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                multiline={true}
              />
            )}
            name="message"
          />
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <SelectPetsArea pets={pets} value={value} onChange={onChange} />
            )}
            name="pets"
          />
          {errors.pets && <Text>Plesae select at least one pet</Text>}
          <Button mode="contained" onPress={handleSubmit(onSubmit)}>
            Request
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

interface SelectPetsAreaProps {
  pets: Pet[];
  value: string[] | undefined;
  onChange: (event: string[]) => void;
}

function SelectPetsArea({ pets, value, onChange }: SelectPetsAreaProps) {
  const [selected] = useState<Map<string, boolean>>(
    new Map(
      pets.map((p) => [
        p._id!,
        (value ?? []).find((id) => id === p._id!) != undefined,
      ])
    )
  );

  const handleSelect = (id: string) => {
    // flip the selected pet
    selected.set(id, !(selected.get(id) ?? false));
    // create an array of all the pets ids that have been selected,
    // onChange will re-render this component so no need for setSelected in useState
    onChange(
      [...selected].filter(([_, checked]) => checked).map(([id, _]) => id)
    );
  };

  return (
    <View>
      <Text variant="titleMedium">Select Pets</Text>
      {pets.map((pet) => (
        <PetCheckBox
          key={pet._id}
          pet={pet}
          checked={selected.get(pet._id!) ?? false}
          onPress={() => handleSelect(pet._id!)}
        />
      ))}
    </View>
  );
}

interface PetCheckBoxProps {
  pet: Pet;
  checked: boolean;
  onPress: () => void;
}

function PetCheckBox({ pet, checked, onPress }: PetCheckBoxProps) {
  return (
    <View style={{ flexDirection: "row", padding: 20 }}>
      <Checkbox
        key={pet._id}
        status={checked ? "checked" : "unchecked"}
        onPress={onPress}
      />
      <Avatar.Icon icon={"dog"} size={40} style={{ padding: 10 }} />
      <Text style={{ padding: 10 }}>{pet.name}</Text>
      <Text style={{ padding: 10 }}>{pet.petType}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 5,
  },
});
