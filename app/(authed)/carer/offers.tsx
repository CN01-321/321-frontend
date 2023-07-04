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

const offersData: Array<Job> = [
  {
    jobId: "0",
    ownerId: "0",
    ownerName: "Owner Name",
    ownerIcon: "icon",
    pets: [
      { petId: "0", petName: "pet", petType: "dog" },
      { petId: "1", petName: "pet", petType: "cat" },
      { petId: "2", petName: "pet", petType: "bird" },
      { petId: "3", petName: "pet", petType: "rabbit" },
    ],
    requestedDate: new Date(),
    distance: 3,
    startDate: new Date(),
    endDate: new Date(),
    location: "wollongong",
    additionalInfo: "looking for someone to care for my pets",
  },
  {
    jobId: "1",
    ownerId: "1",
    ownerName: "Owner Name",
    ownerIcon: "icon",
    pets: [
      { petId: "0", petName: "pet", petType: "dog" },
      { petId: "1", petName: "pet", petType: "cat" },
      { petId: "2", petName: "pet", petType: "bird" },
      { petId: "3", petName: "pet", petType: "rabbit" },
    ],
    requestedDate: new Date(),
    distance: 3,
    startDate: new Date(),
    endDate: new Date(),
    location: "wollongong",
    additionalInfo: "looking for someone to care for my pets",
  },
  {
    jobId: "2",
    ownerId: "2",
    ownerName: "Owner Name",
    ownerIcon: "icon",
    pets: [
      { petId: "0", petName: "pet", petType: "dog" },
      { petId: "1", petName: "pet", petType: "cat" },
      { petId: "2", petName: "pet", petType: "bird" },
      { petId: "3", petName: "pet", petType: "rabbit" },
    ],
    requestedDate: new Date(),
    distance: 3,
    startDate: new Date(),
    endDate: new Date(),
    location: "wollongong",
    additionalInfo: "looking for someone to care for my pets",
  },
];

type OfferType = "direct" | "broad";

export default function Offers() {
  const [offerType, setOfferType] = useState<OfferType>("direct");
  const [offers, setOffers] = useState<Array<Job>>([]);

  useEffect(() => {
    // TODO switch datas depending on current view
    setOffers(offerType === "direct" ? offersData : offersData);
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
