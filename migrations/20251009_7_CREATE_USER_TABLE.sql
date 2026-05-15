CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role        VARCHAR(50) NOT NULL DEFAULT 'Student',
  first_name  VARCHAR(100),
  last_name   VARCHAR(100),
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);