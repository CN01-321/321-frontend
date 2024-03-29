/**
 * @file Route for owners to search for nearby carers
 * @author George Bull
 */

import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { Searchbar, useTheme } from "react-native-paper";
import NewRequestModal from "../../../components/modals/NewRequestModal";
import Header from "../../../components/Header";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import {
  CarerResult,
  NearbyCarer,
  PetSize,
  PetType,
} from "../../../types/types";
import SearchFilterModal from "../../../components/modals/SearchFilterModal";
import { filterCarers } from "../../../utilities/utils";
import { fetchData } from "../../../utilities/fetch";
import SearchResultListView from "../../../components/views/SearchResultListView";

export interface Filters {
  maxPrice?: number;
  minRating?: number;
  petTypes: Map<PetType, boolean>;
  petSizes: Map<PetSize, boolean>;
}

const defaultFilters = () => {
  return {
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
};

export default function Search() {
  const [filters, setFilters] = useState<Filters>(defaultFilters());
  const [filterVisible, setFilterVisible] = useState(false);
  const [requestVisible, setRequestVisible] = useState(false);
  const [carers, setCarers] = useState<NearbyCarer[]>([]);
  const [searchResults, setSearchResults] = useState<NearbyCarer[]>([]);
  const [selectedCarer, setSelectedCarer] = useState<CarerResult>();
  const { pushError } = useMessageSnackbar();
  const theme = useTheme();

  useEffect(() => {
    fetchData("/owners/requests/nearby", setCarers, () =>
      pushError("Could not fetch carers")
    );
  }, []);

  useEffect(() => {
    setSearchResults(filterCarers(filters, carers));
  }, [carers, filters]);

  const updateFilters = (filter: Filters) => {
    setFilters({ ...filter });
  };

  const clearFilters = () => setFilters(defaultFilters());

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header showLogo showButtons title="Search" />
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
      <SearchResultListView
        results={searchResults}
        onRequest={(carer) => {
          setSelectedCarer(carer);
          setRequestVisible(true);
        }}
        emptyTitle="No Results"
        emptySubtitle="Try broadening the filters"
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
