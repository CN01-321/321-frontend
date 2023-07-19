import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Modal,
  Portal,
  SegmentedButtons,
  Text,
} from "react-native-paper";
import JobsListView, { Job } from "../../../components/JobsListView";
import axios from "axios";
import { CarerResult } from "../../../components/CarerResultsView";

// const offersData: Array<Job> = [
//   {
//     _id: "0",
//     ownerId: "0",
//     ownerName: "Owner Name",
//     ownerIcon: "icon",
//     pets: [
//       { _id: "0", name: "pet", petType: "dog" },
//       { _id: "1", name: "pet", petType: "cat" },
//       { _id: "2", name: "pet", petType: "bird" },
//     ],
//     requestedDate: new Date(),
//     distance: 3,
//     startDate: new Date(),
//     endDate: new Date(),
//     location: "wollongong",
//     additionalInfo: "looking for someone to care for my pets",
//   },
//   {
//     _id: "1",
//     ownerId: "1",
//     ownerName: "Owner Name",
//     ownerIcon: "icon",
//     pets: [{ _id: "0", name: "pet", petType: "dog" }],
//     requestedDate: new Date(),
//     distance: 3,
//     startDate: new Date(),
//     endDate: new Date(),
//     location: "wollongong",
//     additionalInfo: "looking for someone to care for my pets",
//   },
//   {
//     _id: "2",
//     ownerId: "2",
//     ownerName: "Owner Name",
//     ownerIcon: "icon",
//     pets: [
//       { _id: "0", name: "pet", petType: "dog" },
//       { _id: "1", name: "pet", petType: "cat" },
//     ],
//     requestedDate: new Date(),
//     distance: 3,
//     startDate: new Date(),
//     endDate: new Date(),
//     location: "wollongong",
//     additionalInfo: "looking for someone to care for my pets",
//   },
// ];

type OfferType = "direct" | "broad";

export default function Offers() {
  const [offerType, setOfferType] = useState<OfferType>("direct");
  const [offers, setOffers] = useState<Array<Job>>([]);

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      try {
        const { data } = await axios.get<Array<Job>>(`/carers/${offerType}`);

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

        console.log(offers);

        if (!ignore) {
          setOffers(offers);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => (ignore = true);
    // TODO switch datas depending on current view
    // setOffers(offerType === "direct" ? offersData : offersData);
  }, [offerType]);

  return (
    <View>
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
      <JobsListView jobs={offers} jobType={offerType} />
    </View>
  );
}
