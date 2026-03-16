import { useState, useEffect, useCallback } from "react";

export interface GuardianSettings {
  protectionEnabled: boolean;
  filterLevel: "strict" | "moderate" | "light";
  partnerName: string;
  partnerEmail: string;
  partnerPhone: string;
  alertsEnabled: boolean;
  realTimeScanning: boolean;
  safeSearch: boolean;
}

export interface BlockedDomain {
  domain: string;
  category: string;
  added_at: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: "blocked" | "warning" | "allowed";
  domain: string;
  category: string;
}

const DEFAULT_SETTINGS: GuardianSettings = {
  protectionEnabled: true,
  filterLevel: "strict",
  partnerName: "",
  partnerEmail: "",
  partnerPhone: "",
  alertsEnabled: false,
  realTimeScanning: true,
  safeSearch: true,
};

const SAMPLE_DOMAINS: BlockedDomain[] = [
  { domain: "example-adult.com", category: "Adult", added_at: new Date().toISOString() },
  { domain: "unsafe-content.net", category: "Adult", added_at: new Date().toISOString() },
  { domain: "gambling-site.com", category: "Gambling", added_at: new Date().toISOString() },
  { domain: "violence-hub.org", category: "Violence", added_at: new Date().toISOString() },
];

const SAMPLE_ACTIVITY: ActivityLog[] = [
  { id: "1", timestamp: new Date(Date.now() - 300000).toISOString(), type: "blocked", domain: "example-adult.com", category: "Adult" },
  { id: "2", timestamp: new Date(Date.now() - 900000).toISOString(), type: "blocked", domain: "unsafe-content.net", category: "Adult" },
  { id: "3", timestamp: new Date(Date.now() - 1800000).toISOString(), type: "warning", domain: "borderline-site.com", category: "Suggestive" },
  { id: "4", timestamp: new Date(Date.now() - 3600000).toISOString(), type: "allowed", domain: "safe-site.org", category: "Safe" },
  { id: "5", timestamp: new Date(Date.now() - 7200000).toISOString(), type: "blocked", domain: "gambling-site.com", category: "Gambling" },
  { id: "6", timestamp: new Date(Date.now() - 10800000).toISOString(), type: "allowed", domain: "news-site.com", category: "Safe" },
];

export function useSettings() {
  const [settings, setSettings] = useState<GuardianSettings>(() => {
    const saved = localStorage.getItem("guardian-settings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const updateSettings = useCallback((partial: Partial<GuardianSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem("guardian-settings", JSON.stringify(next));
      return next;
    });
  }, []);

  return { settings, updateSettings };
}

export function useBlockedDomains() {
  const [domains, setDomains] = useState<BlockedDomain[]>(() => {
    const saved = localStorage.getItem("guardian-domains");
    return saved ? JSON.parse(saved) : SAMPLE_DOMAINS;
  });

  const addDomain = useCallback((domain: string, category: string) => {
    setDomains((prev) => {
      const next = [{ domain, category, added_at: new Date().toISOString() }, ...prev];
      localStorage.setItem("guardian-domains", JSON.stringify(next));
      return next;
    });
  }, []);

  const removeDomain = useCallback((domain: string) => {
    setDomains((prev) => {
      const next = prev.filter((d) => d.domain !== domain);
      localStorage.setItem("guardian-domains", JSON.stringify(next));
      return next;
    });
  }, []);

  return { domains, addDomain, removeDomain };
}

export function useActivityLog() {
  const [logs] = useState<ActivityLog[]>(SAMPLE_ACTIVITY);
  return { logs };
}
