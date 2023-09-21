import { useLocalSearchParams } from "expo-router";
import { useTheme } from "react-native-paper";
import { View, useWindowDimensions } from "react-native";
import { useEffect, useState, ReactNode } from "react";
import ReviewsView, { Review } from "../../../components/ReviewsView";
import axios from "axios";
import { Pet } from "../../../types/types";
import Header from "../../../components/Header";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import PetInfoView from "../../../components/PetInfoView";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";

type OwnPet = "true" | undefined;

const renderTabBar = (props: any): ReactNode => {
  const theme = useTheme();

  return (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: theme.colors.primary }}
      style={{ elevation:0, backgroundColor: "#FCFCFC" }}
      labelStyle={{ 
        color: "#1D1B20",
        fontFamily: "Montserrat-Medium"
      }}
    /> 
  );
}

export default function PetView() {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);

  const { petId, ownPet } = useLocalSearchParams<{
    petId: string;
    ownPet?: OwnPet;
  }>();
  const [pet, setPet] = useState<Pet>({
    _id: "",
    name: "Pet",
    petType: "dog",
    petSize: "small",
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const { pushError } = useMessageSnackbar();

  const getPetProfile = async (): Promise<Pet> => {
    const { data } = await axios.get<Pet>(`/pets/${petId}`);
    return data;
  };

  const getPetReviews = async (): Promise<Review[]> => {
    const { data } = await axios.get<Review[]>(`/pets/${petId}/feedback`);
    return data;
  };

  useEffect((): (() => void) => {
    let ignore = false;

    (async () => {
      try {
        const [pet, reviews] = await Promise.all([
          getPetProfile(),
          getPetReviews(),
        ]);

        if (!ignore) {
          setPet(pet);
          setReviews(reviews);
        }
      } catch (e) {
        console.error(e);
        pushError("Could not fetch pet information");
      }
    })();

    return () => (ignore = true);
  }, []);

  const FirstRoute = () => (
    <PetInfoView pet={pet} />
  );

  const SecondRoute = () => (
    <ReviewsView
      profile={pet}
      isSelf={ownPet !== undefined}
      reviews={reviews}
      isPet={true}
      updateReviews={async () => {
        setReviews(await getPetReviews());
      }}
    />
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const [routes] = useState([
    { key: 'first', title: 'Profile' },
    { key: 'second', title: 'Reviews' },
  ]);

  return (
    <>
      <Header title={pet.name} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </>
  );
}
