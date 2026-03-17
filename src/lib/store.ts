import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  id: string;
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

export function useSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<GuardianSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("guardian_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setSettings({
          protectionEnabled: data.protection_enabled,
          filterLevel: data.filter_level as GuardianSettings["filterLevel"],
          partnerName: data.partner_name || "",
          partnerEmail: data.partner_email || "",
          partnerPhone: data.partner_phone || "",
          alertsEnabled: data.alerts_enabled,
          realTimeScanning: data.real_time_scanning,
          safeSearch: data.safe_search,
        });
      }
      setLoading(false);
    };
    fetchSettings();
  }, [user]);

  const updateSettings = useCallback(
    async (partial: Partial<GuardianSettings>) => {
      if (!user) return;
      const next = { ...settings, ...partial };
      setSettings(next);

      const dbData = {
        user_id: user.id,
        protection_enabled: next.protectionEnabled,
        filter_level: next.filterLevel,
        partner_name: next.partnerName,
        partner_email: next.partnerEmail,
        partner_phone: next.partnerPhone,
        alerts_enabled: next.alertsEnabled,
        real_time_scanning: next.realTimeScanning,
        safe_search: next.safeSearch,
      };

      await supabase.from("guardian_settings").upsert(dbData, { onConflict: "user_id" });
    },
    [user, settings]
  );

  return { settings, updateSettings, loading };
}

export function useBlockedDomains() {
  const { user } = useAuth();
  const [domains, setDomains] = useState<BlockedDomain[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("blocked_domains")
        .select("*")
        .eq("user_id", user.id)
        .order("added_at", { ascending: false });
      if (data) setDomains(data.map(d => ({ id: d.id, domain: d.domain, category: d.category, added_at: d.added_at })));
    };
    fetch();
  }, [user]);

  const addDomain = useCallback(
    async (domain: string, category: string) => {
      if (!user) return;
      const { data } = await supabase
        .from("blocked_domains")
        .insert({ user_id: user.id, domain, category })
        .select()
        .single();
      if (data) setDomains((prev) => [{ id: data.id, domain: data.domain, category: data.category, added_at: data.added_at }, ...prev]);
    },
    [user]
  );

  const removeDomain = useCallback(
    async (id: string) => {
      if (!user) return;
      await supabase.from("blocked_domains").delete().eq("id", id).eq("user_id", user.id);
      setDomains((prev) => prev.filter((d) => d.id !== id));
    },
    [user]
  );

  return { domains, addDomain, removeDomain };
}

export function useActivityLog() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (data)
        setLogs(
          data.map((l) => ({
            id: l.id,
            timestamp: l.created_at,
            type: l.type as ActivityLog["type"],
            domain: l.domain,
            category: l.category,
          }))
        );
    };
    fetch();
  }, [user]);

  return { logs };
}
