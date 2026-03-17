
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Guardian settings table (per user)
CREATE TABLE public.guardian_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  protection_enabled BOOLEAN NOT NULL DEFAULT true,
  filter_level TEXT NOT NULL DEFAULT 'strict' CHECK (filter_level IN ('strict', 'moderate', 'light')),
  partner_name TEXT DEFAULT '',
  partner_email TEXT DEFAULT '',
  partner_phone TEXT DEFAULT '',
  alerts_enabled BOOLEAN NOT NULL DEFAULT false,
  real_time_scanning BOOLEAN NOT NULL DEFAULT true,
  safe_search BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.guardian_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings" ON public.guardian_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON public.guardian_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON public.guardian_settings FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_guardian_settings_updated_at BEFORE UPDATE ON public.guardian_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Blocked domains table
CREATE TABLE public.blocked_domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Other',
  added_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blocked_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own domains" ON public.blocked_domains FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own domains" ON public.blocked_domains FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own domains" ON public.blocked_domains FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_blocked_domains_user ON public.blocked_domains(user_id);

-- Activity logs table
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('blocked', 'warning', 'allowed')),
  domain TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own logs" ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_activity_logs_user ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_created ON public.activity_logs(created_at DESC);
