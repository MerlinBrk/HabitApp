import {create} from 'zustand';

type StoreState = {
    list: string[];
    addName: (name: string ) => void;
    clearList: () => void;
    currentCommunityName: string;
    addCommunityName: (name: string) => void;
    clearCommunityname: () => void;
}

export const useStore = create<StoreState>((set) => ({
    list: [],
    addName: (name) => set((state) => ({ list: [...state.list, name] })),
    clearList: () => set({ list: [] }),
    currentCommunityName: "",
    addCommunityName: (name) => set({ currentCommunityName: name }),
    clearCommunityname: () => set({ currentCommunityName: "" }),
}))
