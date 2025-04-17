import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { User, Tweet } from "@/types";

const { persistAtom } = recoilPersist();

export const currentUserState = atom<User | null>({
  key: "currentUserState",
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const tweetsState = atom<Tweet[]>({
  key: "tweetsState",
  default: [],
});

export const usersState = atom<Record<string, User>>({
  key: "usersState",
  default: {},
});

export const uiState = atom<{
  isLoading: boolean;
  searchQuery: string;
  activeModal: string | null;
  activeFeed: "home" | "explore" | "user" | "liked";
}>({
  key: "uiState",
  default: {
    isLoading: false,
    searchQuery: "",
    activeModal: null,
    activeFeed: "home",
  },
});

