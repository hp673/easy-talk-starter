-- Fix security warning: Set search_path for function
-- First drop the trigger, then the function, then recreate both with proper security settings

DROP TRIGGER IF EXISTS update_notification_configs_updated_at ON public.notification_configs;
DROP FUNCTION IF EXISTS public.update_notification_configs_updated_at();

-- Recreate function with security definer and search_path
CREATE OR REPLACE FUNCTION public.update_notification_configs_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER update_notification_configs_updated_at
BEFORE UPDATE ON public.notification_configs
FOR EACH ROW
EXECUTE FUNCTION public.update_notification_configs_updated_at();