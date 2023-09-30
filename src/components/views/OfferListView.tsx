import { FlatList, View } from "react-native";
import { Job, OfferType } from "../../types/types";
import OfferCard from "../cards/OfferCard";
import { useState } from "react";
import axios from "axios";
import { useMessageSnackbar } from "../../contexts/messageSnackbar";
import OfferInfoModal from "../modals/OfferInfoModal";
import EmptyListView, { EmptyListViewProps } from "./EmptyListView";
import { useTheme } from "react-native-paper";

interface OffersListViewProps extends Omit<EmptyListViewProps, "userType"> {
  offers: Job[];
  offerType: OfferType;
  updateOffers: () => Promise<void>;
}

export default function OffersListView({
  offers,
  offerType,
  updateOffers,
  emptyTitle,
  emptySubtitle,
}: OffersListViewProps) {
  const [visible, setVisible] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<Job>();
  const [refreshing, setRefreshing] = useState(false);
  const { pushMessage, pushError } = useMessageSnackbar();
  const theme = useTheme();

  if (offers.length === 0) {
    return (
      <EmptyListView
        userType="carer"
        emptyTitle={emptyTitle}
        emptySubtitle={emptySubtitle}
      />
    );
  }

  const handleAccept = async () => {
    setRefreshing(true);
    try {
      await axios.post(`/carers/${offerType}/${currentOffer?._id}/accept`);
      if (updateOffers) await updateOffers();
      pushMessage(
        offerType === "direct"
          ? 'Offer has been succeessfully moved to "Jobs".'
          : `Successfully applied to ${currentOffer?.ownerName}'s request`
      );
    } catch (err) {
      console.error(err);
      pushError("Failed to accept offer");
    }

    setVisible(false);
    setRefreshing(false);
  };

  const handleReject = async () => {
    setRefreshing(true);
    try {
      await axios.post(`/carers/${offerType}/${currentOffer?._id}/reject`);
      if (updateOffers) await updateOffers();

      pushMessage("Offer has been succeessfully rejected.");
    } catch (err) {
      console.error(err);
      pushError("Failed to reject offer");
    }

    setVisible(false);
    setRefreshing(false);
  };

  return (
    <View
      style={{
        height: "100%",
        backgroundColor: theme.colors.background,
      }}
    >
      <FlatList
        data={offers}
        renderItem={({ item }) => (
          <OfferCard
            offer={item}
            onSelect={() => {
              setCurrentOffer(item);
              setVisible(true);
            }}
          />
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{
          paddingBottom: 100,
          backgroundColor: theme.colors.background,
        }}
        onRefresh={updateOffers}
        refreshing={refreshing}
      />
      {currentOffer ? (
        <OfferInfoModal
          title="Offer Details"
          info={currentOffer}
          offerType={offerType}
          visible={visible}
          onDismiss={() => setVisible(false)}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      ) : null}
    </View>
  );
}
