import {create} from 'zustand';

type ListItem = {
    id: string;
    name: string;
}

type StoreState = {
    list: ListItem[];
    addName: (id:string, name: string ) => void;
    clearList: () => void;
    currentCommunityName: string;
    addCommunityName: (name: string) => void;
    clearCommunityname: () => void;
}

export const useStore = create<StoreState>((set) => ({
    list: [],
    addName: (id,name) => set((state) => ({ list: [...state.list, { id, name }] })),
    clearList: () => set({ list: [] }),
    currentCommunityName: "",
    addCommunityName: (name) => set({ currentCommunityName: name }),
    clearCommunityname: () => set({ currentCommunityName: "" }),
}))
