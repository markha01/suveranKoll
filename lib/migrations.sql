CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_name VARCHAR(255),
  org_size VARCHAR(50),
  sector VARCHAR(100),
  status VARCHAR(20) DEFAULT 'in_progress',
  sovereignty_score INTEGER,
  score_breakdown JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_answers (
  id SERIAL PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_id VARCHAR(50) NOT NULL,
  answer_value TEXT,
  answer_label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  report_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_answers_assessment ON assessment_answers(assessment_id);
CREATE INDEX IF NOT EXISTS idx_reports_assessment ON reports(assessment_id);
