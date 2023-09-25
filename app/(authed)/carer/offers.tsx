import { useEffect, useState } from "react";
import { Job } from "../../../types/types";
import Header from "../../../components/Header";
import { useMessageSnackbar } from "../../../contexts/messageSnackbar";
import OffersListView from "../../../components/OfferListView";
import ThemedTabView from "../../../components/ThemedTabView";
import { fetchRequestInfo } from "../../../utils";

export default function Offers() {
  const [direct, setDirect] = useState<Job[]>([]);
  const [broad, setBroad] = useState<Job[]>([]);
  const { pushError } = useMessageSnackbar();

  const updateOffers = async () => {
    try {
      const direct = await fetchRequestInfo<Job>("/carers/direct");
      setDirect(direct);

      const broad = await fetchRequestInfo<Job>("/carers/broad");
      setBroad(broad);
    } catch (e) {
      console.error(e);
      pushError(`Could not fetch offers`);
    }
  };

  useEffect((): (() => void) => {
    let ignore = false;

    if (!ignore) updateOffers();

    return () => (ignore = true);
  }, []);

  const directOffersScene = () => (
    <OffersListView
      offers={direct}
      offerType="direct"
      updateOffers={updateOffers}
    />
  );

  const broadOffersScene = () => (
    <OffersListView
      offers={broad}
      offerType={"broad"}
      updateOffers={updateOffers}
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
