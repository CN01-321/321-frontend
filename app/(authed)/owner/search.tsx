import { useState } from "react";
import { ScrollView, View } from "react-native";
import Slider from "@react-native-community/slider";
import { Button, Checkbox, Modal, Portal, Text } from "react-native-paper";
import { DatePickerButton } from "../../../components/DatePickerButton";
import CarerResultsView, {
  CarerResult,
} from "../../../components/CarerResultsView";
import NewRequestModal from "../../../components/NewRequestModal";

interface PetTypes {
  dog: boolean;
  cat: boolean;
  bird: boolean;
  rabbit: boolean;
}

interface PetSizes {
  small: boolean;
  medium: boolean;
  large: boolean;
}

interface Filters {
  startDateTime?: Date;
  endDateTime?: Date;
  maxPrice?: number;
  minRating?: number;
  petTypes: PetTypes;
  petSizes: PetSizes;
}

const searchResultData: Array<CarerResult> = [
  {
    id: "0",
    name: "Carer 1",
    rating: 4,
    message: "I am an enthusiastic pet carer",
    icon: "../../assets/icon.png",
  },
  {
    id: "1",
    name: "Carer 2",
    rating: 2,
    message: "I am an enthusiastic pet carer",
    icon: "../../assets/icon.png",
  },
  {
    id: "2",
    name: "Carer 3",
    rating: 5,
    message: "I am an enthusiastic pet carer",
    icon: "../../assets/icon.png",
  },
  {
    id: "3",
    name: "Carer 1",
    rating: 4,
    message: "I am an enthusiastic pet carer",
    icon: "../../assets/icon.png",
  },
  {
    id: "4",
    name: "Carer 2",
    rating: 2,
    message: "I am an enthusiastic pet carer",
    icon: "../../assets/icon.png",
  },
  {
    id: "5",
    name: "Carer 3",
    rating: 5,
    message: "I am an enthusiastic pet carer",
    icon: "../../assets/icon.png",
  },
];
export default function Search() {
  const [filters, setFilters] = useState<Filters>({
    petTypes: {
      dog: false,
      cat: false,
      bird: false,
      rabbit: false,
    },
    petSizes: {
      small: false,
      medium: false,
      large: false,
    },
  });
  const [filterVisible, setFilterVisible] = useState(false);
  const [requestVisible, setRequestVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<CarerResult>>([]);
  const [selectedCarer, setSelectedCarer] = useState<CarerResult | null>();

  const updateFilters = (filter: Filters) => {
    setFilters({ ...filter });
  };

  const doSearch = () => {
    console.log("searching with filters", filters);
    setSearchResults(searchResultData);
  };

  return (
    <View>
      <Text>Search</Text>
      <Button mode="contained" onPress={() => setFilterVisible(true)}>
        Filters
      </Button>
      <Button mode="contained" onPress={doSearch}>
        Search
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
  const updateStartDate = (date: Date) => {
    filters.startDateTime = date;
    updateFilters(filters);
  };

  const updateEndDate = (date: Date) => {
    filters.endDateTime = date;
    updateFilters(filters);
  };

  const updateMaxPrice = (price: number) => {
    filters.maxPrice = price;
    updateFilters(filters);
  };

  const updateMinRating = (rating: number) => {
    filters.minRating = rating;
    updateFilters(filters);
  };

  const updatePetTypes = (pet: PetTypeKey) => {
    filters.petTypes[pet] = !filters.petTypes[pet];
    updateFilters(filters);
  };

  const updatePetSizes = (size: PetSizeKey) => {
    filters.petSizes[size] = !filters.petSizes[size];
    updateFilters(filters);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        style={{ backgroundColor: "white" }}
      >
        <ScrollView>
          <Text variant="titleMedium">Filters</Text>
          <DatePickerButton
            label="Start Date"
            date={filters.startDateTime}
            updateDate={updateStartDate}
          />
          <DatePickerButton
            label="End date"
            date={filters.endDateTime}
            updateDate={updateEndDate}
          />
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
            step={1}
            onValueChange={updateMinRating}
          />
          <Text>Select Pet Types</Text>
          <FilterSelection<PetTypeKey, PetTypes>
            selections={filters.petTypes}
            onSelection={updatePetTypes}
          />
          <Text>Select Pet Sizes</Text>
          <FilterSelection<PetSizeKey, PetSizes>
            selections={filters.petSizes}
            onSelection={updatePetSizes}
          />
          <Button mode="contained" onPress={onDismiss}>
            Set Filters
          </Button>
        </ScrollView>
      </Modal>
    </Portal>
  );
}

type PetTypeKey = "dog" | "cat" | "bird" | "rabbit";
type PetSizeKey = "small" | "medium" | "large";

type FilterType = PetTypes | PetSizes;
type FilterTypeKey = PetTypeKey | PetSizeKey;

interface FilterSelectionProps<K extends FilterTypeKey, T extends FilterType> {
  selections: T;
  onSelection: (selection: K) => void;
}

function FilterSelection<K extends FilterTypeKey, T extends FilterType>({
  selections,
  onSelection,
}: FilterSelectionProps<K, T>) {
  return (
    <View>
      {Object.entries(selections).map(([selection, checked]) => (
        <FilterSelectionCheckbox
          key={selection}
          selection={selection as K}
          checked={checked}
          onCheck={() => onSelection(selection as K)}
        />
      ))}
    </View>
  );
}

interface FilterSelectionCheckboxProps<K extends FilterTypeKey> {
  selection: K;
  name?: string;
  checked: boolean;
  onCheck: () => void;
}

function FilterSelectionCheckbox<K extends FilterTypeKey>({
  selection,
  name,
  checked,
  onCheck,
}: FilterSelectionCheckboxProps<K>) {
  return (
    <View style={{ flexDirection: "row", padding: 20 }}>
      <Checkbox status={checked ? "checked" : "unchecked"} onPress={onCheck} />
      <Text>{name ? name : selection}</Text>
    </View>
  );
}
