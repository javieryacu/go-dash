-- GoDash Initial Schema
-- Based on: GoDash_Resumen_Ejecutivo.md Section 7
-- Compatible with Supabase Cloud (uses gen_random_uuid)

-- ===========================================
-- EXTENSIONS
-- ===========================================
CREATE EXTENSION IF NOT EXISTS "vector";

-- ===========================================
-- ENUMS
-- ===========================================
CREATE TYPE experience_level AS ENUM ('junior', 'mid', 'senior');
CREATE TYPE training_goal AS ENUM ('learn_product', 'improve_skill', 'master_channel', 'prepare_pitch');
CREATE TYPE track_type AS ENUM ('standard', 'ai_generated');
CREATE TYPE simulation_channel AS ENUM ('whatsapp', 'email', 'phone', 'f2f');
CREATE TYPE simulation_difficulty AS ENUM ('easy', 'medium', 'hard', 'extreme');
CREATE TYPE objection_type AS ENUM ('price', 'timing', 'authority', 'need', 'trust', 'competition');

-- ===========================================
-- COMPANIES (B2B)
-- ===========================================
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  seats_purchased INTEGER DEFAULT 0,
  crm_integration_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- PROFILES (Users)
-- ===========================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  experience_level experience_level DEFAULT 'junior',
  training_goal training_goal,
  total_simulations INTEGER DEFAULT 0,
  avg_simulation_score DECIMAL(5,2) DEFAULT 0,
  is_company_admin BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- LEARNING PATHS
-- ===========================================
CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  track_type track_type DEFAULT 'standard',
  industry TEXT,
  syllabus_data JSONB DEFAULT '[]'::jsonb,
  current_module_index INTEGER DEFAULT 0,
  total_modules INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  embeddings vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- SIMULATIONS
-- ===========================================
CREATE TABLE simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  path_id UUID REFERENCES learning_paths(id) ON DELETE SET NULL,
  channel simulation_channel NOT NULL,
  difficulty simulation_difficulty DEFAULT 'medium',
  client_persona JSONB DEFAULT '{}'::jsonb,
  transcript JSONB DEFAULT '[]'::jsonb,
  duration_seconds INTEGER DEFAULT 0,
  user_talk_percentage DECIMAL(5,2) DEFAULT 0,
  pauses_count INTEGER DEFAULT 0,
  overall_score INTEGER DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
  discovery_score INTEGER DEFAULT 0 CHECK (discovery_score >= 0 AND discovery_score <= 100),
  qualification_score INTEGER DEFAULT 0 CHECK (qualification_score >= 0 AND qualification_score <= 100),
  objection_handling_score INTEGER DEFAULT 0 CHECK (objection_handling_score >= 0 AND objection_handling_score <= 100),
  closing_score INTEGER DEFAULT 0 CHECK (closing_score >= 0 AND closing_score <= 100),
  ai_feedback JSONB DEFAULT '{}'::jsonb,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- OBJECTION DRILLS (Reflex Gym)
-- ===========================================
CREATE TABLE objection_drills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  objection_text TEXT NOT NULL,
  objection_type objection_type NOT NULL,
  ideal_response TEXT,
  times_seen INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  next_review_date TIMESTAMPTZ DEFAULT NOW(),
  mastered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- STANDARD TRACKS (Pre-built content)
-- ===========================================
CREATE TABLE standard_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  industry TEXT NOT NULL,
  difficulty simulation_difficulty DEFAULT 'medium',
  syllabus_template JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- INDEXES
-- ===========================================
CREATE INDEX idx_profiles_company ON profiles(company_id);
CREATE INDEX idx_profiles_experience ON profiles(experience_level);
CREATE INDEX idx_learning_paths_user ON learning_paths(user_id);
CREATE INDEX idx_learning_paths_type ON learning_paths(track_type);
CREATE INDEX idx_simulations_user ON simulations(user_id);
CREATE INDEX idx_simulations_path ON simulations(path_id);
CREATE INDEX idx_simulations_channel ON simulations(channel);
CREATE INDEX idx_objection_drills_user ON objection_drills(user_id);
CREATE INDEX idx_objection_drills_review ON objection_drills(next_review_date);

-- ===========================================
-- ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE objection_drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE standard_tracks ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Profiles: Company admins can view team profiles
CREATE POLICY "Company admins can view team" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles admin
      WHERE admin.id = auth.uid()
      AND admin.is_company_admin = TRUE
      AND admin.company_id = profiles.company_id
    )
  );

-- Learning Paths: Users can CRUD their own paths
CREATE POLICY "Users can manage own paths" ON learning_paths
  FOR ALL USING (auth.uid() = user_id);

-- Simulations: Users can CRUD their own simulations
CREATE POLICY "Users can manage own simulations" ON simulations
  FOR ALL USING (auth.uid() = user_id);

-- Objection Drills: Users can CRUD their own drills
CREATE POLICY "Users can manage own drills" ON objection_drills
  FOR ALL USING (auth.uid() = user_id);

-- Standard Tracks: Everyone can read active tracks
CREATE POLICY "Anyone can view active tracks" ON standard_tracks
  FOR SELECT USING (is_active = TRUE);

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_learning_paths_updated_at
  BEFORE UPDATE ON learning_paths
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_simulations_updated_at
  BEFORE UPDATE ON simulations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_objection_drills_updated_at
  BEFORE UPDATE ON objection_drills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to handle new user signup (creates profile)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ===========================================
-- MATERIALIZED VIEW for Performance Dashboard
-- ===========================================
CREATE MATERIALIZED VIEW user_performance_summary AS
SELECT 
  p.id as user_id,
  p.email,
  p.full_name,
  p.experience_level,
  p.company_id,
  COUNT(s.id) as total_simulations,
  COALESCE(AVG(s.overall_score), 0) as avg_overall_score,
  COALESCE(AVG(s.discovery_score), 0) as avg_discovery_score,
  COALESCE(AVG(s.qualification_score), 0) as avg_qualification_score,
  COALESCE(AVG(s.objection_handling_score), 0) as avg_objection_score,
  COALESCE(AVG(s.closing_score), 0) as avg_closing_score,
  COUNT(CASE WHEN s.channel = 'whatsapp' THEN 1 END) as whatsapp_count,
  COUNT(CASE WHEN s.channel = 'email' THEN 1 END) as email_count,
  COUNT(CASE WHEN s.channel = 'phone' THEN 1 END) as phone_count,
  COUNT(CASE WHEN s.channel = 'f2f' THEN 1 END) as f2f_count,
  (SELECT COUNT(*) FROM objection_drills od WHERE od.user_id = p.id AND od.mastered = TRUE) as objections_mastered
FROM profiles p
LEFT JOIN simulations s ON s.user_id = p.id AND s.completed = TRUE
GROUP BY p.id, p.email, p.full_name, p.experience_level, p.company_id;

-- Index for fast lookups
CREATE UNIQUE INDEX idx_user_performance_summary ON user_performance_summary(user_id);
