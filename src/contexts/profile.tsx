import { PropsWithChildren, createContext, useContext, useState } from "react";
import { fetchData } from "../utilities/fetch";
import { useMessageSnackbar } from "./messageSnackbar";
import axios from "axios";
import { Review } from "../components/views/ReviewsView";
import { ReviewForm } from "../components/modals/NewReviewModal";
import { CarerProfile, OwnerProfile, Pet } from "../types/types";

type ProfileType = "user" | "pet";
type ContextProfile = OwnerProfile | CarerProfile | Pet;

function isPet(pet: ContextProfile): pet is Pet {
  if ("userType" in pet) {
    return false;
  }

  return true;
}

interface ProfileContextType {
  fetchProfile: (profile: string, profileType: ProfileType) => Promise<void>;
  getPetProfile: () => Pet | null;
  getUserProfile: () => OwnerProfile | CarerProfile | null;
  getReviews: () => Review[];
  newReview: (review: ReviewForm) => Promise<void>;
  likeReview: (reviewId: string) => Promise<void>;
  newComment: (reviewId: string, message: string) => Promise<void>;
}
const ProfileContext = createContext<ProfileContextType>({
  fetchProfile: () => {
    throw new Error("Reviews context not initialised");
  },
  getPetProfile: () => {
    throw new Error("Reviews context not initialised");
  },
  getUserProfile: () => {
    throw new Error("Reviews context not initialised");
  },
  getReviews: () => {
    throw new Error("Reviews context not initialised");
  },
  newReview: () => {
    throw new Error("Reviews context not initialised");
  },
  likeReview: () => {
    throw new Error("Reviews context not initialised");
  },
  newComment: () => {
    throw new Error("Reviews context not initialised");
  },
});

export function useProfile() {
  return useContext(ProfileContext);
}

export function ProfileContextProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState<ContextProfile>();
  const [profileType, setProfileType] = useState<ProfileType>("user");
  const [reviews, setReviews] = useState<Review[]>([]);
  const { pushMessage, pushError } = useMessageSnackbar();

  const profileUrl = (profileId: string, type: ProfileType) =>
    `/${type}s/${profileId}`;

  const reviewsUrl = (profileId: string, type: ProfileType) =>
    `${profileUrl(profileId, type)}/feedback`;

  const fetchProfile = async (profileId: string, type: ProfileType) => {
    await fetchData(profileUrl(profileId, type), setProfile, () =>
      pushError("Could not fetch profile")
    );

    await fetchData(reviewsUrl(profileId, type), setReviews, () => {
      pushError("Could not fetch profile reviews");
    });

    setProfileType(profileType);
  };

  const getPetProfile = () => {
    if (!profile || !isPet(profile)) {
      return null;
    }

    return profile;
  };

  const getUserProfile = () => {
    if (!profile || isPet(profile)) {
      return null;
    }

    return profile;
  };

  const getReviews = () => reviews;

  const newReview = async (review: ReviewForm) => {
    if (!profile) {
      throw new Error("No profile set for new review");
    }

    await axios.post(`${reviewsUrl(profile._id, profileType)}`, review);
    pushMessage("Successfully submitted review!");

    await fetchProfile(profile._id, profileType);
  };

  const likeReview = async (reviewId: string) => {
    if (!profile) {
      throw new Error("No profile set to like review");
    }

    await axios.post(
      `${reviewsUrl(profile._id, profileType)}/${reviewId}/likes`
    );

    await fetchProfile(profile._id, profileType);
  };

  const newComment = async (reviewId: string, message: string) => {
    if (!profile) {
      throw new Error("No profile set to comment");
    }

    await axios.post(
      `${reviewsUrl(profile._id, profileType)}/${reviewId}/comments`,
      {
        message,
      }
    );

    await fetchProfile(profile._id, profileType);
  };

  return (
    <ProfileContext.Provider
      value={{
        fetchProfile,
        getPetProfile,
        getUserProfile,
        getReviews,
        newReview,
        likeReview,
        newComment,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
