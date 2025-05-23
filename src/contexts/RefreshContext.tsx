"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useMemo,
} from "react";

// Type du contexte
interface RefreshContextType {
    refreshKey: number;
    triggerRefresh: () => void;
}

// Création du contexte
const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

// Provider
export function RefreshProvider({ children }: { children: ReactNode }) {
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

    // Memoriser la valeur du contexte pour éviter les re-renders inutiles
    const value = useMemo(() => ({ refreshKey, triggerRefresh }), [refreshKey]);

    return (
        <RefreshContext.Provider value={value}>
            {children}
        </RefreshContext.Provider>
    );
}

// Hook personnalisé
export function useRefresh(): RefreshContextType {
    const context = useContext(RefreshContext);

    if (!context) {
        throw new Error("useRefresh must be used within a RefreshProvider");
    }

    return context;
}
