"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

interface UserData {

    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    birthDate?: string;
    gender?: string;
    location?: string;
    phone?: string;
    avatar?: string;
    bio?: string;
    accType?: 'regular' | 'provider';
    businessName?: string;
    businessType?: string;
    services?: string[];
    certifications?: string;
    description?: string;
    website?: string;
}
interface UserDataContextType {
    userData: UserData | null;
    loading: boolean;
    error: string | null;
    refreshUserData: () => Promise<void>;
}






const UserDataContext = createContext<UserDataContextType | undefined>(undefined);
export function UserDataProvider({ children }: { children: ReactNode }) {

    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUserData();
    }, [1]);

    const fetchUserData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/profile');
            setUserData(response.data.data);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data.error || 'An error occurred while fetching user data');
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    const refreshUserData = async () => {
        await fetchUserData();
    };

    return (
        <UserDataContext.Provider value={{ userData, loading, error, refreshUserData }}>
            {children}
        </UserDataContext.Provider>
    );
}

export function useUserData() {
    const context = useContext(UserDataContext);
    if (context === undefined) {
        throw new Error('useUserData must be used within a UserDataProvider');
    }
    return context;
}
