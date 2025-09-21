-- Initialize GigM8 database
CREATE DATABASE gigm8_jobs;
CREATE USER gigm8 WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE gigm8_jobs TO gigm8;

-- Connect to the database
\c gigm8_jobs;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO gigm8;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO gigm8;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO gigm8;
