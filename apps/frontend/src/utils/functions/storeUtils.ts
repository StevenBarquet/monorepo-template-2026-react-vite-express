import { useAppInfoStore } from "src/store/appInfo";

export const setGlobalLoading = (state: boolean) => useAppInfoStore.setState({ isLoadingGlobal: state });
