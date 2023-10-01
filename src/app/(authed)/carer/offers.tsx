import Header from "../../../components/Header";
import OffersListView from "../../../components/views/OfferListView";
import ThemedTabView from "../../../components/views/ThemedTabView";
import { useOffers } from "../../../contexts/offers";

export default function Offers() {
  const { getDirectOffers, getBroadOffers } = useOffers();

  const directOffersScene = () => (
    <OffersListView
      offers={getDirectOffers()}
      offerType="direct"
      emptyTitle="No Offers"
      emptySubtitle="Come back later to check for new offers"
    />
  );

  const broadOffersScene = () => (
    <OffersListView
      offers={getBroadOffers()}
      offerType="broad"
      emptyTitle="No Nearby Offers"
      emptySubtitle="Come back later to check for new offers"
    />
  );

  const scenes = [
    { key: "direct", title: "My Offers", scene: directOffersScene },
    { key: "broad", title: "Jobs List", scene: broadOffersScene },
  ];

  return (
    <>
      <Header title="Offers" />
      <ThemedTabView scenes={scenes} />
    </>
  );
}
