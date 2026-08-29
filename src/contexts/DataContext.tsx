import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { fetchSiteData, type SiteData } from "@/lib/fetchData";

interface DataContextValue {
  data: SiteData | null;
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextValue>({
  data: null,
  loading: true,
  error: null,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DataContextValue>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    fetchSiteData()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((e) => {
        if (!cancelled) setState({ data: null, loading: false, error: e.message });
      });
    return () => { cancelled = true; };
  }, []);

  if (state.loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#F8F1E7" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "3px solid #E8D8C3", borderTopColor: "#5C3A2E", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#5C3A2E", fontFamily: "Inter, sans-serif" }}>Loading...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#F8F1E7" }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <p style={{ color: "#c00", fontFamily: "Inter, sans-serif", fontSize: 18, marginBottom: 8 }}>Failed to load</p>
          <p style={{ color: "#7A6152", fontFamily: "Inter, sans-serif", fontSize: 14 }}>{state.error}</p>
        </div>
      </div>
    );
  }

  return <DataContext.Provider value={state}>{children}</DataContext.Provider>;
}

export function useDataContext(): SiteData {
  const ctx = useContext(DataContext);
  if (!ctx.data) throw new Error("Data not loaded yet");
  return ctx.data;
}

export function useDataStatus() {
  return useContext(DataContext);
}
