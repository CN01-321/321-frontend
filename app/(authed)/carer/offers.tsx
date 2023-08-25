import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import JobsListView from "../../../components/JobsListView";
import axios from "axios";
import { Job } from "../../../types";
import Header from "../../../components/Header";

type OfferType = "direct" | "broad";

export default function Offers() {
  const { initOfferType } = useLocalSearchParams<{
    initOfferType?: OfferType;
  }>();
  const [offerType, setOfferType] = useState<OfferType>(
    initOfferType ?? "direct"
  );
  const [offers, setOffers] = useState<Job[]>([]);

  const updateOffers = async () => {
    try {
      const { data } = await axios.get<Job[]>(`/carers/${offerType}`);

      // map all date strings to date objects
      const offers = data.map((o) => {
        return {
          ...o,
          requestedOn: new Date(o.requestedOn),
          dateRange: {
            startDate: new Date(o.dateRange.startDate),
            endDate: new Date(o.dateRange.endDate),
          },
        };
      });

      setOffers(offers);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect((): (() => void) => {
    let ignore = false;

    if (!ignore) updateOffers();

    return () => (ignore = true);
  }, [offerType]);

  return (
    <View>
      <Header title="Offers" />
      <SegmentedButtons
        value={offerType}
        onValueChange={(value) => setOfferType(value as OfferType)}
        buttons={[
          {
            value: "direct",
            label: "My Offers",
          },
          {
            value: "broad",
            label: "Jobs List",
          },
        ]}
      />
      <JobsListView
        jobs={offers}
        jobType={offerType}
        updateOffers={updateOffers}
      />
    </View>
  );
}
