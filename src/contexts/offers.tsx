import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Job, OfferType } from "../types/types";
import { fetchRequestInfo } from "../utilities/fetch";
import { useMessageSnackbar } from "./messageSnackbar";
import axios from "axios";
import { isPastJob } from "../utilities/utils";
import { useUser } from "./user";

interface OffersContextType {
  getBroadOffers: () => Job[];
  getDirectOffers: () => Job[];
  getCurrentJobs: () => Job[];
  getPastJobs: () => Job[];
  acceptOffer: (offer: Job, offerType: OfferType) => Promise<void>;
  rejectOffer: (offer: Job, offerType: OfferType) => Promise<void>;
  completeJob: (job: Job) => Promise<void>;
}

const OffersContext = createContext<OffersContextType>({
  getBroadOffers: () => {
    throw new Error("Offers context not initialised");
  },
  getDirectOffers: () => {
    throw new Error("Offers context not initialised");
  },
  getCurrentJobs: () => {
    throw new Error("Offers context not initialised");
  },
  getPastJobs: () => {
    throw new Error("Offers context not initialised");
  },
  acceptOffer: () => {
    throw new Error("Offers context not initialised");
  },
  rejectOffer: () => {
    throw new Error("Offers context not initialised");
  },
  completeJob: () => {
    throw new Error("Offers context not initialised");
  },
});

export function useOffers() {
  return useContext(OffersContext);
}

export function OffersContextProvider({ children }: PropsWithChildren) {
  const [broad, setBroad] = useState<Job[]>([]);
  const [direct, setDirect] = useState<Job[]>([]);
  const [currentJobs, setCurrentJobs] = useState<Job[]>([]);
  const [pastJobs, setPastJobs] = useState<Job[]>([]);
  const { pushMessage } = useMessageSnackbar();
  const { fetchHomeInfo } = useUser();

  const fetchOffers = async () => {
    const direct = await fetchRequestInfo<Job>("/carers/direct");
    setDirect(direct);

    const broad = await fetchRequestInfo<Job>("/carers/broad");
    setBroad(broad);
  };

  const fetchJobs = async () => {
    const jobs = await fetchRequestInfo<Job>("/carers/jobs");

    setCurrentJobs(jobs.filter((j) => !isPastJob(j)));
    setPastJobs(jobs.filter(isPastJob));
  };

  const fetchAll = async () => {
    Promise.all([fetchOffers(), fetchJobs()]);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const getBroadOffers = () => broad;

  const getDirectOffers = () => direct;

  const getCurrentJobs = () => currentJobs;

  const getPastJobs = () => pastJobs;

  const acceptOffer = async (offer: Job, offerType: OfferType) => {
    await axios.post(`/carers/${offerType}/${offer._id}/accept`);

    pushMessage(
      offerType === "direct"
        ? 'Offer has been succeessfully moved to "Jobs".'
        : `Successfully applied to ${offer.ownerName}'s request`
    );
    await fetchAll();
    fetchHomeInfo();
  };

  const rejectOffer = async (offer: Job, offerType: OfferType) => {
    await axios.post(`/carers/${offerType}/${offer._id}/reject`);

    pushMessage("Offer has been succeessfully rejected.");
    await fetchAll();
    fetchHomeInfo();
  };

  const completeJob = async (job: Job) => {
    await axios.post(`/carers/jobs/${job._id}/complete`);
    pushMessage("Successfully completed job!");
    await fetchAll();
    fetchHomeInfo();
  };

  return (
    <OffersContext.Provider
      value={{
        getBroadOffers,
        getDirectOffers,
        getCurrentJobs,
        getPastJobs,
        acceptOffer,
        rejectOffer,
        completeJob,
      }}
    >
      {children}
    </OffersContext.Provider>
  );
}
