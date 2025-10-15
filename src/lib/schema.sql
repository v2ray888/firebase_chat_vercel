-- src/lib/schema.sql

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table: Stores agents and administrators
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar VARCHAR(255),
    role VARCHAR(50) NOT NULL CHECK (role IN ('agent', 'admin')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('online', 'offline')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customers Table: Stores end-users who initiate chats
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cases Table: Represents a support ticket or conversation thread
CREATE TABLE IF NOT EXISTS cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('open', 'in-progress', 'resolved')),
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Messages Table: Stores individual chat messages within a case
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    sender_type VARCHAR(50) NOT NULL CHECK (sender_type IN ('user', 'agent', 'system')),
    content TEXT NOT NULL,
    "timestamp" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- agent's id
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    -- Ensure either user_id or customer_id is set based on sender_type
    CONSTRAINT chk_sender CHECK (
        (sender_type = 'agent' AND user_id IS NOT NULL AND customer_id IS NULL) OR
        (sender_type = 'user' AND customer_id IS NOT NULL AND user_id IS NULL) OR
        (sender_type = 'system' AND user_id IS NULL AND customer_id IS NULL)
    )
);

-- Websites Table: Stores user-registered websites for widget integration
CREATE TABLE IF NOT EXISTS websites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- App Settings Table: A singleton table for global application settings
CREATE TABLE IF NOT EXISTS app_settings (
    id INT PRIMARY KEY CHECK (id = 1),
    primary_color VARCHAR(20) NOT NULL DEFAULT '#64B5F6',
    welcome_message TEXT NOT NULL DEFAULT '您好！我们能为您做些什么？',
    offline_message TEXT NOT NULL DEFAULT '我们目前不在。请留言，我们会尽快回复您。',
    accept_new_chats BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_cases_customer_id ON cases(customer_id);
CREATE INDEX IF NOT EXISTS idx_messages_case_id ON messages(case_id);
CREATE INDEX IF NOT EXISTS idx_websites_user_id ON websites(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages("timestamp" DESC);
CREATE INDEX IF NOT EXISTS idx_cases_updated_at ON cases(updated_at DESC);
