/**
 * @file Modal component for creating a new request
 * @author George Bull
 */

import { Button, Text } from "react-native-paper";
import BaseModal, { BaseModalProps } from "./BaseModal";
import { useEffect } from "react";
import { CarerResult } from "../../types/types";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { DatePickerInput } from "../DatePickerInput";
import { useMessageSnackbar } from "../../contexts/messageSnackbar";
import CheckboxSelectorCard from "../cards/CheckboxSelectorCard";
import { View } from "react-native";
import ThemedTextInput from "../ThemedTextInput";
import ErrorText from "../ErrorText";
import { useRequests } from "../../contexts/requests";
import { usePets } from "../../contexts/pets";

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
}

export default function NewRequestModal({
  title,
  visible,
  onDismiss,
  carerResult,
}: NewRequestModalProps) {
  const { newRequest } = useRequests();
  const { getPets } = usePets();
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
  const { pushError } = useMessageSnackbar();

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

    try {
      await newRequest(postData);
    } catch (e) {
      console.error(e);
      pushError("Error creating new request");
    }

    reset();
    onDismiss();
  };
  return (
    <BaseModal title={title} visible={visible} onDismiss={onDismiss}>
      <Text
        variant="bodySmall"
        style={{ textAlign: "center", paddingBottom: 10 }}
      >
        Please provide the following details
      </Text>
      <View>
        <View>
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
          <ErrorText>{errors.dateRange?.startDate?.message}</ErrorText>
        </View>
        <View>
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
          <ErrorText>{errors.dateRange?.endDate?.message}</ErrorText>
        </View>
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <ThemedTextInput
              label="Additional information"
              value={value}
              onChangeText={onChange}
              multiline={true}
              icon="information-variant"
            />
          )}
          name="message"
        />
        <View style={{ paddingTop: 15 }}>
          <Controller
            control={control}
            rules={{
              validate: (v) =>
                Array.from(v.values()).filter((selected) => selected).length >
                  0 || "At least one pet is required",
            }}
            render={({ field: { onChange, value } }) => (
              <CheckboxSelectorCard
                title="Pets"
                icon="dog-side"
                border={true}
                items={getPets()}
                values={value}
                onItemSelect={onChange}
                keyExtractor={(item) => item._id}
                nameExtractor={(item) => item.name}
              />
            )}
            name="pets"
          />
          <ErrorText>{errors.pets?.message}</ErrorText>
        </View>
      </View>
      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        Request
      </Button>
    </BaseModal>
  );
}
