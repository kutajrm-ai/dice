CREATE TABLE IF NOT EXISTS public.data_documents (
  path text PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('static', 'voter_register')),
  body jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.signups (
  source_path text PRIMARY KEY,
  data jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS signups_created_at_idx ON public.signups(created_at);
REVOKE ALL ON TABLE public.data_documents, public.signups FROM PUBLIC;
ALTER TABLE public.data_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signups ENABLE ROW LEVEL SECURITY;
