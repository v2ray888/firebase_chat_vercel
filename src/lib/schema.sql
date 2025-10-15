-- Users Table: Stores login and profile information for agents and admins.
CREATE TABLE
  IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    role VARCHAR(50) NOT NULL CHECK (role IN ('agent', 'admin')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('online', 'offline')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

-- Customers Table: Stores information about the end-users seeking support.
CREATE TABLE
  IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

-- Cases Table: Represents a single support case or conversation thread.
CREATE TABLE
  IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    customer_id UUID REFERENCES customers (id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('open', 'in-progress', 'resolved')),
    summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

-- Messages Table: Stores individual messages within a case.
CREATE TABLE
  IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    case_id UUID REFERENCES cases (id) ON DELETE CASCADE,
    sender_type VARCHAR(50) NOT NULL CHECK (sender_type IN ('user', 'agent', 'system')),
    content TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES users (id) ON DELETE SET NULL, -- agent's id
    customer_id UUID REFERENCES customers (id) ON DELETE SET NULL
  );

-- App Settings Table: Stores global application settings.
CREATE TABLE
  IF NOT EXISTS app_settings (
    id INT PRIMARY KEY,
    primary_color VARCHAR(20) NOT NULL,
    welcome_message TEXT NOT NULL,
    offline_message TEXT NOT NULL,
    accept_new_chats BOOLEAN NOT NULL
  );

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cases_customer_id ON cases (customer_id);
CREATE INDEX IF NOT EXISTS idx_messages_case_id ON messages (case_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages ("timestamp" DESC);