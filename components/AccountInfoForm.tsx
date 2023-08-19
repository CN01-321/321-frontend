import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import axios from "axios";

import * as Location from "expo-location";

type FormData = {
  name: string;
  street: string;
  city: string;
  state: string;
  postcode: string;
  coords: number[];
  bio: string;
}

const AccountInfoForm = () => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
        name: "",
        street: "",
        city: "",
        state: "",
        postcode: "",
        bio: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const geocodedLocation = await Location.geocodeAsync(`${data.street} ${data.city} ${data.state} ${data.postcode}`);
    data.coords = [geocodedLocation[0].latitude,  geocodedLocation[0].longitude];
    try {
      await axios.post("/owners/pets", data);
    } catch (error) {
      console.log(error);
    }
    reset();
  }

  return (
    <View>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="street"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Street"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="city"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="City"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="state"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="State"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="postcode"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Postcode"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="bio"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Bio"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        Submit Info
      </Button>
    </View>
  );
}
 
export default AccountInfoForm;