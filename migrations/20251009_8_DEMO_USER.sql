
INSERT INTO users (email, password_hash, role, first_name, last_name)
VALUES ('student1@example.edu', '$2b$12$W29E4mW45jeXxMacfJ6o.ufu3Aopnw8q9u6fxHAxXqRhbdh05lVEu', 'Student', 'Alex', 'Ng')
ON CONFLICT (email) DO NOTHING;