/**
 * @file Shows a list of a request's respondents or an empty list view
 * @author George Bull
 */

import { FlatList } from "react-native";
import { Respondent } from "../../types/types";
import EmptyListView, { EmptyListViewProps } from "./EmptyListView";
import RespondentCard from "../cards/RespondentCard";

interface RespondentListViewProps extends Omit<EmptyListViewProps, "userType"> {
  respondents: Respondent[];
  onHire: (respondent: Respondent) => void;
}

export default function RespondentListView({
  respondents,
  onHire,
  emptyTitle,
  emptySubtitle,
}: RespondentListViewProps) {
  if (respondents.length === 0) {
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
      data={respondents}
      renderItem={({ item }) => (
        <RespondentCard respondent={item} onHire={() => onHire(item)} />
      )}
      keyExtractor={(item) => item._id}
    />
  );
}
