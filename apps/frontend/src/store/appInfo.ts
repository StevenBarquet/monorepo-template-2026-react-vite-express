import { create, type StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  isLoadingGlobal: boolean;
}

const initialState: State = {
  isLoadingGlobal: false,
};

export interface AppInfoStore extends State {
  update: (data: Partial<State>) => void;
  set: (data: State) => void;
  reset: () => void;
}

const actions: StateCreator<AppInfoStore> = (set) => ({
  ...initialState,
  update: (data) => set((state) => ({ ...state, ...data })),
  set: (data) => set(() => data),
  reset: () => set(() => initialState),
});

// ------------BOILERPLATE-----
export const useAppInfoStore = create<AppInfoStore>()(
  devtools(actions, { name: 'AppInfo' }),
);
