-- Criar tabela de leads de parceiros
CREATE TABLE IF NOT EXISTS partnership_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE partnership_leads ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção anônima (qualquer pessoa pode se cadastrar)
CREATE POLICY "Allow anonymous insert" ON partnership_leads
    FOR INSERT TO anon
    WITH CHECK (true);

-- Política para leitura apenas por usuários autenticados (admins)
CREATE POLICY "Authenticated users can read" ON partnership_leads
    FOR SELECT TO authenticated
    USING (true);

-- Índice para busca por email
CREATE INDEX idx_partnership_leads_email ON partnership_leads(email);

-- Índice para busca por status
CREATE INDEX idx_partnership_leads_status ON partnership_leads(status);
