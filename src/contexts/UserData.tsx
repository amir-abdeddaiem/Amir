"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

interface UserData {
    _id?: string;
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




const exampleUserData: UserData = {
    _id: "6824d3420b47408a868cacb2",
    accType: "regular",
    birthDate: "2025-05-25T00:00:00.000Z",
    email: "t@t",
    firstName: "t",
    gender: "male",
    lastName: "t",
    location: "Location: 36.806500, 10.181500",
    phone: "65552221",
    services: [],

    avatar: undefined,
    bio: undefined,
    businessName: undefined,
    businessType: undefined,
    certifications: undefined,
    description: undefined,
    website: undefined
};




const UserDataContext = createContext<UserDataContextType | undefined>(undefined);
export function UserDataProvider({ children }: { children: ReactNode }) {

    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        setUserData(exampleUserData);
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = typeof window !== 'undefined' ? Cookies.get('token') : null;

            // const response = await axios.get('/api/profile', {
            //     headers: {
            //         ...(token ? { Authorization: `Bearer ${token}` } : {}),
            //     },
            // });

            setUserData(exampleUserData);
            console.log(userData);
        } catch (err) {
            const axiosError = err as AxiosError;
            const message = axiosError.response?.data
                ? JSON.stringify(axiosError.response.data)
                : axiosError.message;
            console.error('Error fetching user data:', message);
            setError('Failed to fetch user data');
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
