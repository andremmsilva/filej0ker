CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_name VARCHAR(32) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_role VARCHAR(50) NOT NULL,
    active BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS contact_requests (
    id SERIAL PRIMARY KEY,
    firstId INTEGER REFERENCES users(user_id) NOT NULL,
    secondId INTEGER REFERENCES users(user_id) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- invited | friends | refused | blocked
    contactStatus VARCHAR(8) NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    userId INTEGER REFERENCES users(user_id) NOT NULL,
    msg VARCHAR(255) NOT NULL,
    seen BOOLEAN DEFAULT FALSE
)
