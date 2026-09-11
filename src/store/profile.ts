import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'ml' | 'kn' | 'gu' | 'ta' | 'te' | 'bn';

export interface Profile {
  phone: string;
  location: string; // e.g., 'Kochi'
  vesselType: string;
  language: Language;
  phoneVerified: boolean;
}

interface ProfileContextValue {
  profile: Profile;
  setProfile: (profile: Profile) => void;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const defaultProfile: Profile = {
    phone: '',
    location: 'Kochi',
    vesselType: 'Motorized Boat',
    language: 'en',
    phoneVerified: false,
  };

  const [profile, setProfileState] = useState<Profile>(() => {
    try {
      const stored = localStorage.getItem('tarangProfile');
      return stored ? JSON.parse(stored) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const setProfile = (newProfile: Profile) => {
    setProfileState(newProfile);
    localStorage.setItem('tarangProfile', JSON.stringify(newProfile));
  };

  // Keep localStorage in sync if profile changes elsewhere
  useEffect(() => {
    localStorage.setItem('tarangProfile', JSON.stringify(profile));
  }, [profile]);

  return React.createElement(ProfileContext.Provider, { value: { profile, setProfile } }, children);
};

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return ctx;
};
