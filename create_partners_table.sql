-- Criar tabela de parceiros aprovados
CREATE TABLE IF NOT EXISTS partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    referral_code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active',
    total_referrals INTEGER DEFAULT 0,
    total_bonus DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Política para parceiros verem apenas seus próprios dados
CREATE POLICY "Partners can view own data" ON partners
    FOR SELECT TO authenticated
    USING (email = auth.email());

-- Política para admins verem todos os parceiros
CREATE POLICY "Admins can view all partners" ON partners
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_whitelist WHERE email = auth.email()
        )
    );

-- Política para admins inserirem parceiros
CREATE POLICY "Admins can insert partners" ON partners
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_whitelist WHERE email = auth.email()
        )
    );

-- Índices
CREATE INDEX idx_partners_email ON partners(email);
CREATE INDEX idx_partners_referral_code ON partners(referral_code);
