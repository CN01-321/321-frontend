import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import Slider from "@react-native-community/slider";
import {
  Button,
  Checkbox,
  Modal,
  Portal,
  Searchbar,
  Text,
} from "react-native-paper";
import CarerResultsView, {
  CarerResult,
} from "../../../components/CarerResultsView";
import NewRequestModal from "../../../components/NewRequestModal";
import axios from "axios";
import Header from "../../../components/Header";

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
  maxPrice?: number;
  minRating?: number;
  petTypes: PetTypes;
  petSizes: PetSizes;
}

const defaultFilters = () => {
  return {
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
  };
};

export default function Search() {
  const [filters, setFilters] = useState<Filters>(defaultFilters());
  const [filterVisible, setFilterVisible] = useState(false);
  const [requestVisible, setRequestVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<CarerResult>>([]);
  const [selectedCarer, setSelectedCarer] = useState<CarerResult | null>();

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      await doSearch();

      console.log("searching with filters", filters);

      console.log("query string ", getQueryString());
      try {
        const { data } = await axios.get<Array<CarerResult>>(
          `/owners/requests/nearby${getQueryString()}`
        );

        console.log("search results ", data);
        if (!ignore) {
          setSearchResults(data);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => (ignore = true);
  }, [filters]);

  const updateFilters = (filter: Filters) => {
    setFilters({ ...filter });
  };

  const getQueryString = () => {
    // construct the query parameters for the api call
    let query = "?";
    if (filters.maxPrice) {
      query += `price=${filters.maxPrice}&`;
    }

    // filter all chosen pet types and add them as petTypes[]=type to the query string
    query += Object.entries(filters.petTypes)
      .filter(([_, selected]) => selected)
      .reduce(
        (petTypeQuery, [petType, _]) => petTypeQuery + `petTypes[]=${petType}&`,
        ""
      );

    // do the same thing for pet sizes
    query += Object.entries(filters.petSizes)
      .filter(([_, selected]) => selected)
      .reduce(
        (petSizeQuery, [petSize, _]) => petSizeQuery + `petSizes[]=${petSize}&`,
        ""
      );

    return query;
  };

  const doSearch = async () => {};

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
  // const updateStartDate = (date: Date) => {
  //   filters.startDateTime = date;
  //   updateFilters(filters);
  // };

  // const updateEndDate = (date: Date) => {
  //   filters.endDateTime = date;
  //   updateFilters(filters);
  // };

  const updateMaxPrice = (price: number) => {
    filters.maxPrice = price;
    updateFilters(filters);
  };

  // const updateMinRating = (rating: number) => {
  //   filters.minRating = rating;
  //   updateFilters(filters);
  // };

  const updatePetTypes = (pet: PetTypeKey) => {
    filters.petTypes[pet] = !filters.petTypes[pet];
    updateFilters(filters);
  };

  const updatePetSizes = (size: PetSizeKey) => {
    filters.petSizes[size] = !filters.petSizes[size];
    updateFilters(filters);
  };

  const clearFilters = () => {
    updateFilters(defaultFilters());
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
          {/* <DatePickerButton
            label="Start Date"
            date={filters.startDateTime}
            updateDate={updateStartDate}
          />
          <DatePickerButton
            label="End date"
            date={filters.endDateTime}
            updateDate={updateEndDate}
          /> */}
          <Text>Max Price: {filters.maxPrice}</Text>
          <Slider
            minimumValue={0}
            maximumValue={200}
            step={25}
            onValueChange={updateMaxPrice}
          />
          {/* <Text>Min Rating: {filters.minRating}</Text>
          <Slider
            minimumValue={0}
            maximumValue={5}
            step={1}
            onValueChange={updateMinRating}
          /> */}
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
          <Button mode="contained" onPress={clearFilters}>
            Clear Filters
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
