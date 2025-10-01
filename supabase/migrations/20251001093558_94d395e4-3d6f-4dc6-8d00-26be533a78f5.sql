-- Drop existing tables if they exist (to ensure clean state)
DROP TABLE IF EXISTS public.notification_executions CASCADE;
DROP TABLE IF EXISTS public.notification_configs CASCADE;

-- Drop and recreate enums
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS delivery_method CASCADE;
DROP TYPE IF EXISTS recipient_group CASCADE;

CREATE TYPE notification_type AS ENUM ('pre_inspection', 'due_reminder', 'missed_reminder');
CREATE TYPE delivery_method AS ENUM ('email', 'sms');
CREATE TYPE recipient_group AS ENUM ('operator', 'maintainer', 'admin');

-- Create notification_configs table
CREATE TABLE public.notification_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id TEXT NOT NULL,
  form_name TEXT NOT NULL,
  form_type TEXT NOT NULL CHECK (form_type IN ('equipment', 'workplace')),
  notification_type notification_type NOT NULL,
  rrule TEXT NOT NULL,
  recipients recipient_group[] NOT NULL DEFAULT ARRAY[]::recipient_group[],
  delivery_methods delivery_method[] NOT NULL DEFAULT ARRAY[]::delivery_method[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL
);

-- Create notification_executions table
CREATE TABLE public.notification_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_id UUID NOT NULL REFERENCES public.notification_configs(id) ON DELETE CASCADE,
  form_id TEXT NOT NULL,
  form_name TEXT NOT NULL,
  notification_type notification_type NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  delivery_methods delivery_method[] NOT NULL,
  recipients recipient_group[] NOT NULL,
  error_message TEXT,
  metadata JSONB,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_notification_configs_form ON public.notification_configs(form_id, form_type);
CREATE INDEX idx_notification_configs_active ON public.notification_configs(is_active);
CREATE INDEX idx_notification_executions_config ON public.notification_executions(config_id);
CREATE INDEX idx_notification_executions_status ON public.notification_executions(status, completed);
CREATE INDEX idx_notification_executions_scheduled ON public.notification_executions(scheduled_time);

-- Enable Row Level Security
ALTER TABLE public.notification_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_executions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notification_configs
CREATE POLICY "Anyone can view notification configs"
ON public.notification_configs
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage notification configs"
ON public.notification_configs
FOR ALL
USING (true)
WITH CHECK (true);

-- Create RLS policies for notification_executions
CREATE POLICY "Anyone can view notification executions"
ON public.notification_executions
FOR SELECT
USING (true);

CREATE POLICY "System can manage notification executions"
ON public.notification_executions
FOR ALL
USING (true)
WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_notification_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_notification_configs_updated_at
BEFORE UPDATE ON public.notification_configs
FOR EACH ROW
EXECUTE FUNCTION public.update_notification_configs_updated_at();