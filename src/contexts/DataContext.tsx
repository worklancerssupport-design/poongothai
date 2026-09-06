import { createContext, useContext, type ReactNode } from "react";
import { loadLocalData, type SiteData } from "@/lib/fetchData";

interface DataContextValue {
  data: SiteData;
}

const localData = loadLocalData();

const DataContext = createContext<DataContextValue>({
  data: localData,
});

export function DataProvider({ children }: { children: ReactNode }) {
  return <DataContext.Provider value={{ data: localData }}>{children}</DataContext.Provider>;
}

export function useDataContext(): SiteData {
  return useContext(DataContext).data;
}

export function useDataStatus() {
  return { data: useContext(DataContext).data, loading: false, error: null };
}
