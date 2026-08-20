-- =============================================
-- Solacera Supabase Schema
-- Paste this entire file into the Supabase SQL editor and run.
-- =============================================

-- Households
CREATE TABLE IF NOT EXISTS households (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  care_recipient_name text,
  created_at timestamptz DEFAULT now()
);

-- Extend auth.users profile
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  household_id uuid REFERENCES households(id),
  created_at timestamptz DEFAULT now()
);

-- Household members (lightweight, non-auth family members for task assignment)
CREATE TABLE IF NOT EXISTS household_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid REFERENCES households(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Reminders (Medicine + Wellness)
CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid REFERENCES households(id) ON DELETE CASCADE,
  created_by uuid REFERENCES auth.users(id),
  type text NOT NULL CHECK (type IN ('medicine','hydration','sleep','activity')),
  name text NOT NULL,
  reminder_time time NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Tasks (Family Coordination)
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid REFERENCES households(id) ON DELETE CASCADE,
  created_by uuid REFERENCES auth.users(id),
  title text NOT NULL,
  description text,
  assignee_name text,
  due_datetime timestamptz,
  status text DEFAULT 'pending' CHECK (status IN ('pending','completed')),
  created_at timestamptz DEFAULT now()
);

-- Chat messages (Companion)
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id uuid NOT NULL,
  sender text NOT NULL CHECK (sender IN ('user','bot')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Solace sessions
CREATE TABLE IF NOT EXISTS solace_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type text NOT NULL,
  duration_minutes int NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- =============================================
-- Row Level Security
-- =============================================

ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE solace_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles: user can read/write own
CREATE POLICY "profiles_own" ON profiles FOR ALL USING (auth.uid() = id);

-- Households: user can access their household
CREATE POLICY "households_member" ON households FOR ALL
  USING (id IN (SELECT household_id FROM profiles WHERE id = auth.uid()));

-- Household members: same household
CREATE POLICY "household_members_read" ON household_members FOR ALL
  USING (household_id IN (SELECT household_id FROM profiles WHERE id = auth.uid()));

-- Reminders: same household
CREATE POLICY "reminders_household" ON reminders FOR ALL
  USING (household_id IN (SELECT household_id FROM profiles WHERE id = auth.uid()));

-- Tasks: same household
CREATE POLICY "tasks_household" ON tasks FOR ALL
  USING (household_id IN (SELECT household_id FROM profiles WHERE id = auth.uid()));

-- Chat: own messages only
CREATE POLICY "chat_own" ON chat_messages FOR ALL USING (user_id = auth.uid());

-- Solace: own sessions only
CREATE POLICY "solace_own" ON solace_sessions FOR ALL USING (user_id = auth.uid());

-- =============================================
-- Enable Realtime for Family Coordination
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE reminders;

-- =============================================
-- Seed household members (defaults, customisable per household)
-- =============================================
-- (Actual seed happens after a household is created via the app)