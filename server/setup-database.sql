-- HHW Business Management System Database Setup
-- Run this in PostgreSQL (pgAdmin or psql command line)

-- Create database
CREATE DATABASE hhw_business;

-- Create user (optional - you can use your existing postgres user)
-- CREATE USER hhw_admin WITH PASSWORD 'secure_password_here';

-- Grant privileges
-- GRANT ALL PRIVILEGES ON DATABASE hhw_business TO hhw_admin;

-- Connect to the database
\c hhw_business;

-- Verify connection
SELECT current_database();
