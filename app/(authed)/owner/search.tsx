import { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { Button, Checkbox, Modal, Portal, Text } from "react-native-paper";
import CarerResultsView, {
  CarerResult,
} from "../../../components/CarerResultsView";
import NewRequestModal from "../../../components/modals/NewRequestModal";
import axios from "axios";
import Header from "../../../components/Header";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import { PetSize, PetType } from "../../../types/types";

interface Filters {
  maxPrice?: number;
  minRating?: number;
  petTypes: Map<PetType, boolean>;
  petSizes: Map<PetSize, boolean>;
}

const defaultFilters = {
  petTypes: new Map(
    Object.entries({
      dog: false,
      cat: false,
      bird: false,
      rabbit: false,
    }) as [PetType, boolean][]
  ),
  petSizes: new Map(
    Object.entries({
      small: false,
      medium: false,
      large: false,
    }) as [PetSize, boolean][]
  ),
};

interface NearbyCarer extends CarerResult {
  hourlyRate: number;
  preferredPetTypes: PetType[];
  preferredPetSizes: PetSize[];
}

export default function Search() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [filterVisible, setFilterVisible] = useState(false);
  const [requestVisible, setRequestVisible] = useState(false);
  const [carers, setCarers] = useState<NearbyCarer[]>([]);
  const [searchResults, setSearchResults] = useState<NearbyCarer[]>([]);
  const [selectedCarer, setSelectedCarer] = useState<CarerResult>();
  const { pushError } = useMessageSnackbar();

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      try {
        const { data } = await axios.get<NearbyCarer[]>(
          "/owners/requests/nearby"
        );

        if (!ignore) {
          console.log("nearby carers are ", data);
          setCarers(data);
        }
      } catch (e) {
        console.error(e);
        pushError("Could not fetch carers");
      }
    })();

    return () => (ignore = true);
  }, []);

  const updateFilters = (filter: Filters) => {
    setFilters({ ...filter });
  };

  useEffect(() => {
    const res = carers
      .filter((c) =>
        filters.maxPrice ? c.hourlyRate < filters.maxPrice : true
      )
      .filter((c) =>
        Array.from(filters.petTypes.entries())
          .filter(([, v]) => v)
          .every(([k]) => c.preferredPetTypes.includes(k))
      )
      .filter((c) =>
        Array.from(filters.petSizes.entries())
          .filter(([, v]) => v)
          .every(([k]) => c.preferredPetSizes.includes(k))
      )
      .filter((c) =>
        filters.minRating ? c.rating ?? -1 >= filters.minRating : true
      );

    console.log("search results are: ", res);

    setSearchResults(res);
  }, [carers, filters]);

  return (
    <View>
      <Header title="Search" />
      <Button mode="outlined" onPress={() => setFilterVisible(true)}>
        Filters
      </Button>
      <FilterModal
        visible={filterVisible}
        onDismiss={() => setFilterVisible(false)}
        filters={filters}
        updateFilters={updateFilters}
      />
      <CarerResultsView
        carerResults={searchResults}
        handleRequest={(carerResult) => {
          setSelectedCarer(carerResult);
          setRequestVisible(true);
        }}
        cardButtonLabel="Request Carer's Services"
      />
      <NewRequestModal
        title="Request Carer's Services"
        carerResult={selectedCarer}
        visible={requestVisible}
        onDismiss={() => setRequestVisible(false)}
      />
    </View>
  );
}

interface FilterModalProps {
  visible: boolean;
  onDismiss: () => void;
  filters: Filters;
  updateFilters: (filter: Filters) => void;
}

function FilterModal({
  visible,
  onDismiss,
  filters,
  updateFilters,
}: FilterModalProps) {
  // TODO implement rating and availiability filters, conver to react-hook form
  const updateMaxPrice = (price: number) => {
    filters.maxPrice = price;
    updateFilters(filters);
  };

  const updateMinRating = (rating: number) => {
    filters.minRating = rating;
    updateFilters(filters);
  };

  const updatePetTypes = (selection: PetType) => {
    filters.petTypes.set(selection, !filters.petTypes.get(selection));
    updateFilters(filters);
  };

  const updatePetSizes = (size: PetSize) => {
    filters.petSizes.set(size, !filters.petSizes.get(size));
    updateFilters(filters);
  };

  const clearFilters = () => {
    updateFilters(defaultFilters);
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss}>
        <ScrollView style={styles.container}>
          <Text variant="titleMedium">Filters</Text>
          <Text>Max Price: {filters.maxPrice}</Text>
          <Slider
            minimumValue={0}
            maximumValue={200}
            step={25}
            onValueChange={updateMaxPrice}
          />
          <Text>Min Rating: {filters.minRating}</Text>
          <Slider
            minimumValue={0}
            maximumValue={5}
            step={0.5}
            onValueChange={updateMinRating}
          />
          <Text>Select Pet Types</Text>
          <View style={styles.checkboxArea}>
            <FilterSelection
              selections={filters.petTypes}
              onSelection={updatePetTypes}
            />
          </View>

          <Text>Select Pet Sizes</Text>
          <View style={styles.checkboxArea}>
            <FilterSelection
              selections={filters.petSizes}
              onSelection={updatePetSizes}
            />
          </View>
          <Button mode="contained" onPress={onDismiss}>
            Set Filters
          </Button>
          <Button mode="contained" onPress={clearFilters}>
            Clear Filters
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

type FilterType = PetType | PetSize;

interface FilterSelectionProps<K extends FilterType> {
  selections: Map<K, boolean>;
  onSelection: (selection: K) => void;
}

function FilterSelection<K extends FilterType>({
  selections,
  onSelection,
}: FilterSelectionProps<K>) {
  return (
    <View style={styles.checkboxArea}>
      {Array.from(selections.entries()).map(([selection, checked]) => (
        <FilterSelectionCheckbox
          key={selection}
          selection={selection}
          checked={checked}
          onCheck={() => onSelection(selection)}
        />
      ))}
    </View>
  );
}

interface FilterSelectionCheckboxProps {
  selection: FilterType;
  name?: string;
  checked: boolean;
  onCheck: () => void;
}

function FilterSelectionCheckbox({
  selection,
  name,
  checked,
  onCheck,
}: FilterSelectionCheckboxProps) {
  return (
    <View style={styles.checkbox}>
      <Checkbox status={checked ? "checked" : "unchecked"} onPress={onCheck} />
      <Text>{name ? name : selection}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 5,
  },
  checkboxArea: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  checkbox: {
    flexDirection: "row",
    paddingLeft: 10,
  },
});
