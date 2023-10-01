import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { CarerProfile, OwnerProfile, UserType } from "../types/types";
import { fetchData } from "../utilities/fetch";
import { useAuth } from "./auth";
import axios, { AxiosError } from "axios";
import { ImagePickerAsset } from "expo-image-picker";
import { uploadImage } from "../utilities/image";
import { HomeInfo } from "../app/(authed)/home";
import { useRouter } from "expo-router";
import { useMessageSnackbar } from "./messageSnackbar";

type UserProfileType = OwnerProfile | CarerProfile;
type UserUpdateType = Omit<
  UserProfileType,
  "_id" | "userType" | "totalReviews"
>;

interface UserContextType {
  getUser: () => UserProfileType;
  updateUser: (
    updated: UserUpdateType,
    userType: UserType,
    pfp?: ImagePickerAsset
  ) => Promise<void>;
  getHomeInfo: () => HomeInfo | null;
  fetchHomeInfo: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  getUser: () => {
    throw new Error("User Context not initalised");
  },
  updateUser: () => {
    throw new Error("User Context not initalised");
  },
  getHomeInfo: () => {
    throw new Error("User Context not initalised");
  },
  fetchHomeInfo: () => {
    throw new Error("User Context not initalised");
  },
});

export function useUser() {
  return useContext(UserContext);
}

export function UserContextProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<OwnerProfile | CarerProfile>();
  const [homeInfo, setHomeInfo] = useState<HomeInfo>();
  const { getTokenUser } = useAuth();
  const router = useRouter();
  const { pushError } = useMessageSnackbar();

  const fetchUser = async () => {
    await fetchData(`/users/${getTokenUser()?._id}`, setUser);
  };

  useEffect(() => {
    fetchUser();
    fetchHomeInfo();
  }, []);

  const getUser = () => {
    if (!user) {
      throw new Error("User not defined");
    }

    return user;
  };

  const updateUser = async (
    updated: UserUpdateType,
    userType: UserType,
    pfp?: ImagePickerAsset
  ) => {
    await axios.put(`/${userType}s`, updated);
    if (pfp) await uploadImage("/users/pfp", pfp);
    await fetchUser();
    await fetchHomeInfo();
  };

  const getHomeInfo = () => homeInfo ?? null;

  const fetchHomeInfo = async () => {
    try {
      const { data } = await axios.get<HomeInfo>(
        `/${getTokenUser()?.type}s/home`
      );
      setHomeInfo(data);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 403) {
        router.replace("/more-info");
        return;
      }

      console.error(err);
      pushError("Could not fetch home page information");
    }
  };

  return (
    <UserContext.Provider
      value={{ getUser, updateUser, getHomeInfo, fetchHomeInfo }}
    >
      {children}
    </UserContext.Provider>
  );
}
