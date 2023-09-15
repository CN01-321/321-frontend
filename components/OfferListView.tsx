import { FlatList, View } from "react-native";
import { Job } from "../types";
import OfferCard from "./cards/OfferCard";

interface OffersListViewProps {
  offers: Job[];
  offerType: "direct" | "broad";
  updateOffers: () => Promise<void>;
}

export default function OffersListView({
  offers,
  offerType,
  updateOffers,
}: OffersListViewProps) {
  return (
    <View>
      <FlatList
        data={offers}
        renderItem={({ item }) => (
          <OfferCard
            offer={item}
            offerType={offerType}
            updateOffers={updateOffers}
          />
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}
