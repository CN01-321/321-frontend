/**
 * @file Shows a list of search results or an empty list view
 * @author George Bull
 */

import { FlatList } from "react-native";
import { NearbyCarer } from "../../types/types";
import EmptyListView, { EmptyListViewProps } from "./EmptyListView";
import SearchResultCard from "../cards/SearchResultCard";

interface SearchResultListViewProps
  extends Omit<EmptyListViewProps, "userType"> {
  results: NearbyCarer[];
  onRequest: (carer: NearbyCarer) => void;
}

export default function SearchResultListView({
  results,
  onRequest,
  emptyTitle,
  emptySubtitle,
}: SearchResultListViewProps) {
  if (results.length === 0) {
    return (
      <EmptyListView
        userType="owner"
        emptyTitle={emptyTitle}
        emptySubtitle={emptySubtitle}
      />
    );
  }

  return (
    <FlatList
      data={results}
      renderItem={({ item }) => (
        <SearchResultCard carer={item} onRequest={() => onRequest(item)} />
      )}
    />
  );
}
