/**
 * @file Modal component for filtering search results
 * @author George Bull
 */

import { Button, Text } from "react-native-paper";
import BaseModal, { BaseModalProps } from "./BaseModal";
import {
  PetSize,
  PetType,
  petSelectorSizes,
  petSelectorTypes,
} from "../../types/types";
import CheckboxSelectorCard from "../cards/CheckboxSelectorCard";
import SliderSelectorCard from "../cards/SliderSelectorCard";
import { StyleSheet, View } from "react-native";

interface Filters {
  maxPrice?: number;
  minRating?: number;
  petTypes: Map<PetType, boolean>;
  petSizes: Map<PetSize, boolean>;
}

interface SearchFilterModalProps extends BaseModalProps {
  filters: Filters;
  onChange: (event: Filters) => void;
  onClear: () => void;
}

export default function SearchFilterModal({
  title,
  visible,
  onDismiss,
  filters,
  onChange,
  onClear,
}: SearchFilterModalProps) {
  const updatePetSizeFilter = (petSizeFilter: Map<string, boolean>) => {
    onChange({
      ...filters,
      petSizes: petSizeFilter as Map<PetSize, boolean>,
    });
  };

  const updatePetTypeFilter = (petTypeFilter: Map<string, boolean>) => {
    onChange({
      ...filters,
      petTypes: petTypeFilter as Map<PetType, boolean>,
    });
  };

  const updatePriceFilter = (price: number) => {
    onChange({
      ...filters,
      maxPrice: price,
    });
  };

  const updateRatingFilter = (rating: number) => {
    onChange({
      ...filters,
      minRating: rating,
    });
  };

  return (
    <BaseModal title={title} visible={visible} onDismiss={onDismiss}>
      <Text variant="bodySmall">Choose from the filters below</Text>
      <View style={styles.formSection}>
        <CheckboxSelectorCard
          title="Pet Size"
          icon="scale"
          border={true}
          items={petSelectorSizes}
          values={filters.petSizes}
          onItemSelect={updatePetSizeFilter}
          keyExtractor={(item) => item.key}
          nameExtractor={(item) => item.name}
        />
      </View>
      <View style={styles.formSection}>
        <CheckboxSelectorCard
          title="Type of Pets"
          icon="dog-side"
          border={true}
          items={petSelectorTypes}
          values={filters.petTypes}
          onItemSelect={updatePetTypeFilter}
          keyExtractor={(item) => item.key}
          nameExtractor={(item) => item.name}
        />
      </View>
      <View style={styles.formSection}>
        <SliderSelectorCard
          title={`Price Range ${
            filters.maxPrice ? ": " + filters.maxPrice : ""
          }`}
          icon="currency-usd"
          border={true}
          min={0}
          max={200}
          step={25}
          value={filters.maxPrice}
          onChange={updatePriceFilter}
        />
      </View>
      <View style={styles.formSection}>
        <SliderSelectorCard
          title={`Minimum Rating ${
            filters.minRating ? ": " + filters.minRating : ""
          }`}
          icon="account-star-outline"
          border={true}
          min={0}
          max={5}
          step={0.5}
          value={filters.minRating}
          onChange={updateRatingFilter}
        />
      </View>
      <View style={styles.formSection}>
        <Button mode="outlined" onPress={onClear}>
          Clear Filters
        </Button>
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  formSection: {
    marginVertical: 5,
  },
});
