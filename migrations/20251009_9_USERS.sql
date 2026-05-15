
INSERT INTO users (id, email, password_hash, role, first_name, last_name)
VALUES
  -- Students
  (1,  'student1@example.edu', crypt('Stud123',    gen_salt('bf', 12)), 'Student', 'Alex',   'Ng'),
  (2,  'student2@example.edu', crypt('Stud123',    gen_salt('bf', 12)), 'Student', 'Sofia',  'Hernandez'),
  (3,  'student3@example.edu', crypt('Stud123',    gen_salt('bf', 12)), 'Student', 'Liam',   'Patel'),
  (4,  'student4@example.edu', crypt('Stud123',    gen_salt('bf', 12)), 'Student', 'Mei',    'Wong'),
  (5,  'student5@example.edu', crypt('Stud123',    gen_salt('bf', 12)), 'Student', 'Ethan',  'Smith'),

  -- Admins
  (6,  'admin1@example.edu',   crypt('Admin123',   gen_salt('bf', 12)), 'Admin',   'Priya',  'Shah'),
  (7,  'admin2@example.edu',   crypt('Admin123',   gen_salt('bf', 12)), 'Admin',   'James',  'Brown'),

  -- Advisors
  (8,  'advisor1@example.edu', crypt('Advisor123', gen_salt('bf', 12)), 'Advisor', 'Olivia', 'Khan'),
  (9,  'advisor2@example.edu', crypt('Advisor123', gen_salt('bf', 12)), 'Advisor', 'Carlos', 'Gomez'),

  -- Staff
  (10, 'staff1@example.edu',   crypt('Staff123',   gen_salt('bf', 12)), 'Staff',   'Hannah', 'Miller'),
  (11, 'staff2@example.edu',   crypt('Staff123',   gen_salt('bf', 12)), 'Staff',   'Noah',   'Wilson'),

  -- Guests
  (12, 'guest1@example.edu',   crypt('Guest123',   gen_salt('bf', 12)), 'Guest',   'Grace',  'Taylor'),
  (13, 'guest2@example.edu',   crypt('Guest123',   gen_salt('bf', 12)), 'Guest',   'Oliver', 'Lee')
ON CONFLICT (email) DO NOTHING;

-- Make sure the sequence is set above the highest seeded id
SELECT setval(pg_get_serial_sequence('users', 'id'), GREATEST((SELECT MAX(id) FROM users), 1));