CREATE TABLE IF NOT EXISTS users (
    userId SERIAL PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(32) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    userRole VARCHAR(50) NOT NULL,
    active BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS user_contacts (
    id SERIAL PRIMARY KEY,
    firstId INTEGER REFERENCES users(userId) NOT NULL,
    secondId INTEGER REFERENCES users(userId) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- invited | friends | refused | blocked
    contactStatus VARCHAR(32) NOT NULL,
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    userId INTEGER REFERENCES users(userId) NOT NULL,
    msg VARCHAR(255) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE
)
