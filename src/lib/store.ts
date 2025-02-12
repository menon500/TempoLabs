import { create } from "zustand";

interface EventStore {
  backgroundImage: string;
  setBackgroundImage: (url: string) => void;
}

export const useEventStore = create<EventStore>((set) => ({
  backgroundImage:
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=2400&h=1600&fit=crop",
  setBackgroundImage: (url) => set({ backgroundImage: url }),
}));
