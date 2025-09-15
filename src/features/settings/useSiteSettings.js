import { useEffect, useState, useCallback } from "react";

const KEY = "siteSettings:v1";

export const DEFAULT_SETTINGS = {
  contact: {
    email: "contact@imalex.com",
    phone: "+213700000000",
  },
  socials: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    linkedin: "https://www.linkedin.com",
    x: "https://x.com/",
  },
};

export function useSiteSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // load once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSettings(JSON.parse(raw));
    } catch (_) {
      console.log("Failed to save site settings");
    }
    setIsLoading(false);
  }, []);

  const save = useCallback(async (next) => {
    setIsSaving(true);
    setSettings(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch (_) {
      console.log("Failed to save site settings");
    }
    setIsSaving(false);
    return next;
  }, []);

  return { settings, isLoading, isSaving, save };
}
