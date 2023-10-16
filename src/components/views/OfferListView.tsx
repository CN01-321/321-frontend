/**
 * @file Shows a list of carer's offers or an empty list view
 * @author George Bull
 */

import { FlatList, View } from "react-native";
import { Job, OfferType } from "../../types/types";
import OfferCard from "../cards/OfferCard";
import { useState } from "react";
import { useMessageSnackbar } from "../../contexts/messageSnackbar";
import OfferInfoModal from "../modals/OfferInfoModal";
import EmptyListView, { EmptyListViewProps } from "./EmptyListView";
import { useTheme } from "react-native-paper";
import { useOffers } from "../../contexts/offers";

interface OffersListViewProps extends Omit<EmptyListViewProps, "userType"> {
  offers: Job[];
  offerType: OfferType;
}

export default function OffersListView({
  offers,
  offerType,
  emptyTitle,
  emptySubtitle,
}: OffersListViewProps) {
  const [visible, setVisible] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<Job>();
  const { pushError } = useMessageSnackbar();
  const theme = useTheme();
  const { acceptOffer, rejectOffer } = useOffers();

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
    try {
      if (!currentOffer) {
        throw new Error("No offer selected");
      }

      await acceptOffer(currentOffer, offerType);
    } catch (err) {
      console.error(err);
      pushError("Failed to accept offer");
    }

    setVisible(false);
  };

  const handleReject = async () => {
    try {
      if (!currentOffer) {
        throw new Error("No offer selected");
      }

      await rejectOffer(currentOffer, offerType);
    } catch (err) {
      console.error(err);
      pushError("Failed to reject offer");
    }

    setVisible(false);
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
