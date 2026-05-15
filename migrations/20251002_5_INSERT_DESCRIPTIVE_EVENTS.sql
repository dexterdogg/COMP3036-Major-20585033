DELETE FROM events;
INSERT INTO events (name, description, start_time, end_time, location, category) VALUES
-- Credit to generative AI (CHATGPT) for generating these sample events
-- "I cannot meticulously input these events one by one"

('Basketball Game', 
 'Come cheer, play, or just hang out with friends at a thrilling basketball match! Bring your team spirit and comfy clothes if you’re playing. Water and basic gear are provided. Perfect for students who love sports or just want a fun evening of social energy.', 
 '2025-11-01 18:00:00', '2025-11-01 20:00:00', 'Sydney Olympic Park Basketball Arena', 'sport'),

('MESH Study Group', 
 'A relaxed group study session where students collaborate, share notes, and help each other with assignments. Bring your laptop, notes, and questions. Whiteboards and snacks are provided. Great for anyone wanting accountability and new study buddies.', 
 '2025-11-03 14:00:00', '2025-11-03 16:00:00', 'Parramatta South WSU Library', 'study'),

('Evening Free Dinner', 
 'Enjoy a free hot meal and meet other students over shared tables and conversation. Vegetarian and halal options are provided—just bring your appetite. This event is open to all, especially those looking for a friendly space to relax after classes.', 
 '2025-11-05 18:00:00', '2025-11-05 20:00:00', 'Darling Harbour Food Court', 'social'),

('Mental Health Meetup', 
 'A safe and supportive space to talk about wellbeing, swap coping strategies, and connect with peers. No need to bring anything—light refreshments and resources are provided. Ideal for students seeking support or just wanting to listen and learn.', 
 '2025-11-07 15:00:00', '2025-11-07 17:00:00', 'Campbelltown WSU Wellness Center', 'social'),

('Coding Bootcamp', 
 'An all-day beginner-friendly coding workshop where mentors walk you through basics with hands-on exercises. Bring your laptop; lunch and materials are provided. Perfect for students curious about coding, regardless of background.', 
 '2025-11-09 09:00:00', '2025-11-09 17:00:00', 'Penrith WSU Computer Lab 101', 'study'),

('Yoga Class', 
 'Start your day with a refreshing group yoga flow by the beach. Bring a mat or towel, wear comfy clothes, and a bottle of water. No experience needed—just come to stretch, breathe, and connect with others in a calm atmosphere.', 
 '2025-11-11 07:00:00', '2025-11-11 08:00:00', 'Bondi Beach Pavilion', 'sport'),

('Basketball Game', 
 'An energetic basketball match where you can either play or cheer with your friends. Jerseys and balls are provided, just bring water and shoes. A fun way to stay active and meet new teammates.', 
 '2025-11-13 18:00:00', '2025-11-13 20:00:00', 'Penrith WSU Sports Hall', 'sport'),

('Music Jam Night', 
 'Grab your instrument or just your voice and join an open jam session! Basic amps and mics are provided. Bring your own instrument if you can. A great way to vibe with other music lovers in a casual, supportive space.', 
 '2025-11-15 19:00:00', '2025-11-15 22:00:00', 'Sydney Opera House Foyer', 'social'),

('Weekly Study Group', 
 'Meet up with fellow students for focused study time. Bring your books, laptops, and assignments. Coffee and quiet study spaces are provided. Perfect if you need a push to stay on track with coursework.', 
 '2025-11-17 14:00:00', '2025-11-17 16:00:00', 'Campbelltown WSU Library', 'study'),

('Community BBQ', 
 'Enjoy a casual outdoor barbecue with fellow students. Sausages, veggie options, and drinks are provided—bring a picnic rug and any special snacks you’d like. Expect games, laughter, and a chance to make new friends.', 
 '2025-11-19 12:00:00', '2025-11-19 15:00:00', 'Centennial Park, Sydney', 'social'),

('Basketball Game', 
 'Fast-paced basketball fun at the WSU courts. Come in sneakers if you’re playing; spectators welcome too. Water and first-aid are provided. Great for both players and fans wanting a lively evening.', 
 '2025-11-21 18:00:00', '2025-11-21 20:00:00', 'Parramatta South WSU Sports Hall', 'sport'),

('Career Workshop', 
 'A career-building workshop with practical tips on resumes, interviews, and job searching. Bring your CV if you’d like feedback. Resources and refreshments are provided. Great for students planning their next steps after graduation.', 
 '2025-11-23 10:00:00', '2025-11-23 12:00:00', 'Parramatta South WSU Career Office', 'study'),

('Weekly Study Group', 
 'Regular student meet-up for focused learning. Bring assignments or projects you want to complete. Quiet study zones and occasional snacks are provided. A great way to keep momentum on your coursework.', 
 '2025-11-25 14:00:00', '2025-11-25 16:00:00', 'Penrith WSU Library', 'study'),

('Open Mic Night', 
 'Step onto the stage to sing, recite poetry, or perform comedy—or just come to support your peers! Mic and sound system provided. Bring your courage or your claps. A friendly, inclusive event with lots of laughs.', 
 '2025-11-27 19:00:00', '2025-11-27 22:00:00', 'The Enmore Theatre, Sydney', 'social'),

('Mental Health Meetup', 
 'Relaxed, peer-led discussions on mental health challenges, resources, and wellness habits. Free tea and snacks available, no need to bring anything but yourself. Open to all looking for connection or support.', 
 '2025-11-29 15:00:00', '2025-11-29 17:00:00', 'Parramatta South WSU Wellness Hub', 'social'),

('Chess Tournament', 
 'Test your skills in a friendly chess competition! Boards and timers are provided—just bring your strategy. Open to players of all levels. A quiet but social event where brains clash and friendships form.', 
 '2025-12-01 10:00:00', '2025-12-01 16:00:00', 'State Library of NSW, Sydney', 'gaming'),

('Basketball Game', 
 'Cheer on your friends or join a team for an exciting evening of basketball. Bring sports shoes and water. Jerseys, balls, and referees provided. Fun for players and spectators alike.', 
 '2025-12-03 18:00:00', '2025-12-03 20:00:00', 'Sydney Boys High Gymnasium', 'sport'),

('Film Screening', 
 'Join us for a movie night featuring a popular film. Popcorn and drinks are provided, just bring your friends or come solo to meet new people. A cozy, low-pressure social outing.', 
 '2025-12-05 18:00:00', '2025-12-05 20:30:00', 'Dendy Cinemas, Newtown', 'social'),

('Weekly Study Group', 
 'Group study session to stay motivated before exams. Bring notes, laptops, and coffee. A quiet environment with occasional collaboration. Great for accountability.', 
 '2025-12-07 14:00:00', '2025-12-07 16:00:00', 'Campbelltown WSU Library', 'study'),

('Hackathon', 
 'A full-day coding competition where teams solve challenges and pitch ideas. Bring your laptop and creativity. Food, mentors, and prizes provided. Ideal for aspiring developers or problem-solvers.', 
 '2025-12-09 09:00:00', '2025-12-09 21:00:00', 'UTS Tech Lab, Botany', 'study'),

('Evening Free Dinner', 
 'Share a warm meal with students from all faculties. Free dinner served with vegan/halal options. Bring your appetite and conversation—great way to meet others in a relaxed, communal setting.', 
 '2025-12-11 18:00:00', '2025-12-11 20:00:00', 'Barangaroo Reserve, Sydney', 'social'),

('Yoga Class', 
 'A calming yoga flow to relax your body and mind. Bring a mat or towel, water, and wear stretchy clothes. No prior yoga needed. A great way to de-stress before exams.', 
 '2025-12-13 07:00:00', '2025-12-13 08:00:00', 'Campbelltown WSU Gym Studio', 'sport'),

('Basketball Game', 
 'High-energy basketball event open to all skill levels. Sneakers and water recommended. Jerseys, balls, and referees supplied. Come for the competition or just the vibe.', 
 '2025-12-15 18:00:00', '2025-12-15 20:00:00', 'Parramatta South WSU Sports Hall', 'sport'),

('Photography Walk', 
 'Explore Sydney’s historic Rocks area with your camera or phone. Guides will suggest photo spots. Bring your camera/phone, comfy shoes, and creativity. A fun way to improve skills and meet other photo-enthusiasts.', 
 '2025-12-17 15:00:00', '2025-12-17 17:00:00', 'The Rocks, Sydney', 'social'),

('Weekly Study Group', 
 'Final-week study catchup before the holidays. Bring textbooks, devices, and focus. Quiet study spaces provided. Friendly environment to finish strong.', 
 '2025-12-19 14:00:00', '2025-12-19 16:00:00', 'Penrith WSU Library', 'study'),

('Community Clean-up', 
 'Join fellow students in giving back by cleaning up the beach. Gloves, bags, and water provided. Bring sunscreen, hat, and comfy shoes. A great way to meet eco-minded peers while helping the community.', 
 '2025-12-21 09:00:00', '2025-12-21 12:00:00', 'Bondi Beach, Sydney', 'social'),

('Mental Health Meetup', 
 'Peer-led wellness discussions in a safe space. Free tea and light snacks included. No prep needed, just an open mind. For anyone wanting to connect, share, or listen.', 
 '2025-12-23 15:00:00', '2025-12-23 17:00:00', 'Campbelltown WSU Wellness Center', 'social'),

('Gaming Tournament', 
 'Compete in popular video games at a dedicated gaming arena. Consoles and screens provided, just bring your best skills (and maybe your controller if you prefer). Open to casual and competitive players alike.', 
 '2025-12-27 10:00:00', '2025-12-27 18:00:00', 'EB Games Arena, Sydney CBD', 'gaming'),

('Basketball Game', 
 'Close out the year with a lively basketball game! Sneakers and water recommended. Jerseys, refs, and gear supplied. Perfect way to burn energy and celebrate with friends.', 
 '2025-12-29 18:00:00', '2025-12-29 20:00:00', 'Sydney Olympic Park Basketball Arena', 'sport'),

('Networking Night', 
 'An evening to meet students, alumni, and staff. Light food and drinks provided. Bring business cards or just yourself. A welcoming way to grow connections in a casual setting.', 
 '2026-01-02 18:00:00', '2026-01-02 21:00:00', 'Sydney Town Hall', 'social');