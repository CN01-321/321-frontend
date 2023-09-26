import { useEffect, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { Searchbar, useTheme } from "react-native-paper";
import NewRequestModal from "../../../components/modals/NewRequestModal";
import axios from "axios";
import Header from "../../../components/Header";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import {
  CarerResult,
  NearbyCarer,
  PetSize,
  PetType,
} from "../../../types/types";
import SearchFilterModal from "../../../components/modals/SearchFilterModal";
import SearchResultCard from "../../../components/cards/SearchResultCard";

interface Filters {
  maxPrice?: number;
  minRating?: number;
  petTypes: Map<PetType, boolean>;
  petSizes: Map<PetSize, boolean>;
}

const defaultFilters = {
  petTypes: new Map(
    Object.entries({
      dog: true,
      cat: true,
      bird: true,
      rabbit: true,
    }) as [PetType, boolean][]
  ),
  petSizes: new Map(
    Object.entries({
      small: true,
      medium: true,
      large: true,
    }) as [PetSize, boolean][]
  ),
};

export default function Search() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [filterVisible, setFilterVisible] = useState(false);
  const [requestVisible, setRequestVisible] = useState(false);
  const [carers, setCarers] = useState<NearbyCarer[]>([]);
  const [searchResults, setSearchResults] = useState<NearbyCarer[]>([]);
  const [selectedCarer, setSelectedCarer] = useState<CarerResult>();
  const { pushError } = useMessageSnackbar();
  const theme = useTheme();

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

  const clearFilters = () => setFilters({ ...defaultFilters });

  useEffect(() => {
    const results = [];

    const selectedPetTypes = Array.from(filters.petTypes.entries())
      .filter(([, selected]) => selected)
      .map(([petType]) => petType);

    const selectedPetSizes = Array.from(filters.petSizes.entries())
      .filter(([, selected]) => selected)
      .map(([petSize]) => petSize);

    console.log(selectedPetTypes, selectedPetSizes);

    for (const carer of carers) {
      if (filters.maxPrice && carer.hourlyRate > filters.maxPrice) {
        continue;
      }

      if (
        !carer.preferredPetTypes.every((petType) =>
          selectedPetTypes.includes(petType)
        )
      ) {
        continue;
      }

      if (
        !carer.preferredPetSizes.every((petSize) =>
          selectedPetSizes.includes(petSize)
        )
      ) {
        continue;
      }

      if (
        filters.minRating &&
        carer.rating &&
        filters.minRating > carer.rating
      ) {
        continue;
      }

      results.push(carer);
    }

    // console.log("search results are: ", res);
    console.log("filters are:", filters);

    setSearchResults(results);
  }, [carers, filters]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title="Search" />
      <Pressable onPress={() => setFilterVisible(true)}>
        <Searchbar placeholder="Search" value="" editable={false} />
      </Pressable>
      <SearchFilterModal
        title="Filters"
        visible={filterVisible}
        onDismiss={() => setFilterVisible(false)}
        filters={filters}
        onChange={updateFilters}
        onClear={clearFilters}
      />
      <FlatList
        data={searchResults}
        renderItem={({ item }) => (
          <SearchResultCard
            carer={item}
            onRequest={() => {
              setSelectedCarer(item);
              setRequestVisible(true);
            }}
          />
        )}
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
