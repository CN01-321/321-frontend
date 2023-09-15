import { Button, Card, Text, TextInput, useTheme } from "react-native-paper";
import BaseModal, { BaseModalProps } from "./BaseModal";
import { useEffect, useState } from "react";
import { Pet } from "../../types/types";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { DatePickerInput } from "../DatePickerInput";
import axios from "axios";
import { CarerResult } from "../CarerResultsView";
import { useMessageSnackbar } from "../../contexts/messageSnackbar";
import { PetListItem } from "../PetListItem";

interface NewRequestForm {
  pets: Map<string, boolean>;
  message?: string;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
}

interface NewRequestModalProps extends BaseModalProps {
  carerResult?: CarerResult;
  updateRequests?: () => void;
}

export default function NewRequestModal({
  title,
  visible,
  onDismiss,
  carerResult,
  updateRequests,
}: NewRequestModalProps) {
  const [pets, setPets] = useState<Pet[]>([]);
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<NewRequestForm>({
    defaultValues: {
      pets: new Map(),
    },
  });
  const { pushMessage, pushError } = useMessageSnackbar();
  const theme = useTheme();

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
    // map pets into an array of ids
    const postData = {
      ...data,
      pets: Array.from(data.pets.entries())
        .filter(([, selected]) => selected)
        .map(([petId]) => petId),
      carer: carerResult?._id ?? null,
    };

    console.log("request data is ", postData);

    try {
      await axios.post("/owners/requests", postData);

      pushMessage("Created new request");

      // update the new list if updateRequests is not undefined
      updateRequests && updateRequests();
    } catch (e) {
      console.error(e);
      pushError("Error creating new request");
    }

    reset();
    onDismiss();
  };
  return (
    <BaseModal title={title} visible={visible} onDismiss={onDismiss}>
      <Text variant="bodySmall">Please provide the following details</Text>

      <Controller
        control={control}
        rules={{
          required: "Start date is required",
          // validate that start date is less than end date if end date has been set
          validate: (start) => {
            if (start.getTime() < new Date().getTime()) {
              return "Start Date must be a time in the future";
            }

            const currentEndDate = getValues("dateRange.endDate");
            if (!currentEndDate) {
              return true;
            }

            return (
              start.getTime() < currentEndDate.getTime() ||
              "Start date must be before end date"
            );
          },
        }}
        render={({ field: { onChange, value } }) => (
          <DatePickerInput
            label="Start date"
            date={value}
            updateDate={onChange}
          />
        )}
        name="dateRange.startDate"
      />
      <ErrorText errMsg={errors.dateRange?.startDate?.message} />
      <Controller
        control={control}
        rules={{
          required: "End date is required",
          // validate that end date is more than start date if start date has been set
          validate: (end) => {
            const currentStartDate = getValues("dateRange.startDate");
            if (!currentStartDate) {
              return true;
            }

            return (
              end.getTime() > currentStartDate.getTime() ||
              "End date must be after start date"
            );
          },
        }}
        render={({ field: { onChange, value } }) => (
          <DatePickerInput
            label="End date"
            date={value}
            updateDate={onChange}
          />
        )}
        name="dateRange.endDate"
      />
      <ErrorText errMsg={errors.dateRange?.endDate?.message} />
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Additional information"
            mode="outlined"
            value={value}
            onChangeText={onChange}
            multiline={true}
            outlineColor={theme.colors.primary}
            left={
              <TextInput.Icon
                icon="information-variant"
                iconColor={theme.colors.primary}
              />
            }
          />
        )}
        name="message"
      />
      <Controller
        control={control}
        rules={{
          validate: (v) =>
            Array.from(v.values()).filter((selected) => selected).length > 0 ||
            "At least one pet is required",
        }}
        render={({ field: { onChange, value } }) => (
          <PetSelectList pets={pets} value={value} onPetSelect={onChange} />
        )}
        name="pets"
      />
      <ErrorText errMsg={errors.pets?.message} />
      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        Request
      </Button>
    </BaseModal>
  );
}

interface PetSelectListProps {
  pets: Pet[];
  value: Map<string, boolean>;
  onPetSelect: (event: Map<string, boolean>) => void;
}

function PetSelectList({ pets, value, onPetSelect }: PetSelectListProps) {
  const theme = useTheme();
  return (
    <Card
      style={{
        borderColor: theme.colors.primary,
        borderWidth: 1,
        marginTop: 5,
        padding: 5,
      }}
    >
      <Text variant="titleSmall">Pets</Text>
      {pets.map((p) => (
        <PetListItem
          key={p._id}
          name={p.name}
          checked={value.get(p._id) ? "checked" : "unchecked"}
          onCheck={() => {
            const current = value.get(p._id) ?? false;
            value.set(p._id, !current);
            onPetSelect(new Map([...value]));
          }}
        />
      ))}
    </Card>
  );
}

function ErrorText({ errMsg }: { errMsg?: string }) {
  const theme = useTheme();
  return <Text style={{ color: theme.colors.error }}>{errMsg ?? ""}</Text>;
}
