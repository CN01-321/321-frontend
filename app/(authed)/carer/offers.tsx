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

const icon = require("../../../assets/icon.png");

interface Offer {
  offerId: string;
  ownerId: string;
  ownerName: string;
  ownerIcon?: string;
  pets: Array<{
    petId: string;
    petName: string;
    petType: "dog" | "cat" | "bird" | "rabbit";
  }>;
  distance: number;
  startDate: Date;
  endDate: Date;
  location: string;
  additionalInfo: string;
}

const offersData: Array<Offer> = [
  {
    offerId: "0",
    ownerId: "0",
    ownerName: "Owner Name",
    ownerIcon: "icon",
    pets: [
      { petId: "0", petName: "pet", petType: "dog" },
      { petId: "1", petName: "pet", petType: "cat" },
      { petId: "2", petName: "pet", petType: "bird" },
      { petId: "3", petName: "pet", petType: "rabbit" },
    ],
    distance: 3,
    startDate: new Date(),
    endDate: new Date(),
    location: "wollongong",
    additionalInfo: "looking for someone to care for my pets",
  },
  {
    offerId: "1",
    ownerId: "1",
    ownerName: "Owner Name",
    ownerIcon: "icon",
    pets: [
      { petId: "0", petName: "pet", petType: "dog" },
      { petId: "1", petName: "pet", petType: "cat" },
      { petId: "2", petName: "pet", petType: "bird" },
      { petId: "3", petName: "pet", petType: "rabbit" },
    ],
    distance: 3,
    startDate: new Date(),
    endDate: new Date(),
    location: "wollongong",
    additionalInfo: "looking for someone to care for my pets",
  },
  {
    offerId: "2",
    ownerId: "2",
    ownerName: "Owner Name",
    ownerIcon: "icon",
    pets: [
      { petId: "0", petName: "pet", petType: "dog" },
      { petId: "1", petName: "pet", petType: "cat" },
      { petId: "2", petName: "pet", petType: "bird" },
      { petId: "3", petName: "pet", petType: "rabbit" },
    ],
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
  const [offers, setOffers] = useState<Array<Offer>>([]);

  useEffect(() => {
    // TODO switch datas depending on current view
    setOffers(offerType === "direct" ? offersData : offersData);
  }, [offerType]);

  const handleAccept = (offer: Offer) => {
    console.log(offer, offerType);
  };

  const handleReject = (offer: Offer) => {
    // do nothing if broad request as the carer cannot reject these
    if (offerType === "broad") return;

    console.log(offer, offerType);
  };

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
      <FlatList
        data={offers}
        renderItem={({ item }) => (
          <OfferCard
            offer={item}
            offerType={offerType}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        )}
      />
    </View>
  );
}

interface OfferCardProps {
  offer: Offer;
  offerType: OfferType;
  onAccept: (offer: Offer) => void;
  onReject: (offer: Offer) => void;
}

function OfferCard({ offer, offerType, onAccept, onReject }: OfferCardProps) {
  return (
    <Card>
      <Card.Content>
        {/* TODO switch up for owner icon if present */}
        <Avatar.Image source={icon} size={40} />
        <View>
          <Text variant="titleMedium">
            {offer.pets.map((p) => p.petName).join(", ")} - {offer.ownerName}
          </Text>
          <Text variant="bodyLarge">
            {offer.pets.map((p) => p.petType).join(", ")}
          </Text>
          <Text variant="bodySmall">Distance {offer.distance}km</Text>
          <Link
            href={{ pathname: "profile", params: { userId: offer.ownerId } }}
          >
            View Owner's Profile
          </Link>
          <Link
            href={{ pathname: "profile", params: { userId: offer.ownerId } }}
          >
            View Pets's Profile?
          </Link>
          <Button mode="contained" onPress={() => onAccept(offer)}>
            {offerType === "direct" ? "Accept" : "Apply"}
          </Button>
          {offerType === "broad" ? (
            <Button mode="contained" onPress={() => onReject(offer)}>
              Reject
            </Button>
          ) : null}
        </View>
      </Card.Content>
    </Card>
  );
}
