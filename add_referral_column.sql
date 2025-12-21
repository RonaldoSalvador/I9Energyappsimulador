-- Add referral_id column to leads table
ALTER TABLE leads 
ADD COLUMN referral_id TEXT;

-- Optional: Create an index for faster lookups if you plan to query by partner often
CREATE INDEX idx_leads_referral_id ON leads(referral_id);

-- Add a comment to explain the column
COMMENT ON COLUMN leads.referral_id IS 'Code identifying the partner/referral source (e.g. from ?parceiro=URL param)';
