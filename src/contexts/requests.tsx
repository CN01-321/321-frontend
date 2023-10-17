/**
 * @file Context for owner's requests
 * @author George Bull
 */

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Request } from "../types/types";
import { fetchRequestInfo } from "../utilities/fetch";
import { isPastRequest } from "../utilities/utils";
import { useMessageSnackbar } from "./messageSnackbar";
import axios from "axios";
import { useUser } from "./user";

interface NewRequest {
  pets: string[];
  carer: string | null;
  message?: string | undefined;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
}

interface RequestContextType {
  getCurrentRequests: () => Request[];
  getPastRequests: () => Request[];
  newRequest: (request: NewRequest) => Promise<void>;
  acceptRespondent: (requestId: string, respondentId: string) => Promise<void>;
}

const RequestContext = createContext<RequestContextType>(
  {} as RequestContextType
);

export function useRequests() {
  return useContext(RequestContext);
}

export function RequestContextProvider({ children }: PropsWithChildren) {
  const [current, setCurrent] = useState<Request[]>([]);
  const [past, setPast] = useState<Request[]>([]);
  const { pushMessage, pushError } = useMessageSnackbar();
  const { fetchHomeInfo } = useUser();

  const fetchRequests = async () => {
    try {
      const reqs = await fetchRequestInfo<Request>("/owners/requests");
      setCurrent(reqs.filter((r) => !isPastRequest(r)));
      setPast(reqs.filter(isPastRequest));
    } catch (e) {
      console.error(e);
      pushError("Could not fetch requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getCurrentRequests = () => current;

  const getPastRequests = () => past;

  const newRequest = async (request: NewRequest) => {
    try {
      await axios.post("/owners/requests", request);

      pushMessage("Created new request");

      await fetchRequests();
      fetchHomeInfo();
    } catch (e) {
      console.error(e);
      pushError("Error creating new request");
    }
  };

  const acceptRespondent = async (requestId: string, respondentId: string) => {
    await axios.post(
      `/owners/requests/${requestId}/respondents/${respondentId}`
    );

    pushMessage("Your request has been successfully made!");

    fetchHomeInfo();
  };

  return (
    <RequestContext.Provider
      value={{
        getCurrentRequests,
        getPastRequests,
        newRequest,
        acceptRespondent,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}
