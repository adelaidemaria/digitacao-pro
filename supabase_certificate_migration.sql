-- Tabela de Configuração de Certificados (Uma por Plano)
CREATE TABLE IF NOT EXISTS public.certificate_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES public.plans(id) ON DELETE CASCADE UNIQUE,
  course_name TEXT NOT NULL,
  workload_hours INTEGER NOT NULL DEFAULT 10,
  description TEXT,
  signed_by TEXT NOT NULL,
  required_modules UUID[] DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.certificate_config ENABLE ROW LEVEL SECURITY;

-- Políticas para certificate_config
CREATE POLICY "Enable read access for all users" ON public.certificate_config
  FOR SELECT USING (true);

CREATE POLICY "Enable all access for admins" ON public.certificate_config
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Tabela de Histórico de Certificados Gerados
CREATE TABLE IF NOT EXISTS public.user_certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  stats_wpm INTEGER NOT NULL,
  stats_accuracy INTEGER NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- Evitar que o aluno gere múltiplos registros idênticos por plano
  UNIQUE(user_id, plan_id)
);

-- Habilitar RLS
ALTER TABLE public.user_certificates ENABLE ROW LEVEL SECURITY;

-- Políticas para user_certificates
CREATE POLICY "Users can view their own certificates" ON public.user_certificates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all certificates" ON public.user_certificates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can insert their own certificates" ON public.user_certificates
  FOR INSERT WITH CHECK (auth.uid() = user_id);
