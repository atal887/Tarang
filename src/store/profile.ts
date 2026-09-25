import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'ml' | 'kn' | 'gu' | 'ta' | 'te' | 'bn';

export interface Profile {
  phone: string;
  location: string; // e.g., 'Kochi'
  vesselType: string;
  language: Language;
  phoneVerified: boolean;
  isGuest?: boolean;
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
      const storedLocal = localStorage.getItem('tarangProfile');
      const storedSession = sessionStorage.getItem('tarangProfile');
      if (storedLocal) return JSON.parse(storedLocal);
      if (storedSession) return JSON.parse(storedSession);
      return defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const setProfile = (newProfile: Profile) => {
    setProfileState(newProfile);
    if (newProfile.isGuest) {
      sessionStorage.setItem('tarangProfile', JSON.stringify(newProfile));
      localStorage.removeItem('tarangProfile');
    } else {
      localStorage.setItem('tarangProfile', JSON.stringify(newProfile));
      sessionStorage.removeItem('tarangProfile');
    }
  };

  // Keep storage in sync if profile changes elsewhere
  useEffect(() => {
    if (profile.isGuest) {
      sessionStorage.setItem('tarangProfile', JSON.stringify(profile));
    } else {
      localStorage.setItem('tarangProfile', JSON.stringify(profile));
    }
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
