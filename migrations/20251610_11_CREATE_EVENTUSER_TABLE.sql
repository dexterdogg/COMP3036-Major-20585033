CREATE TABLE IF NOT EXISTS event_users (
    event_user_id SERIAL PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE event_users
    ADD CONSTRAINT unique_event_user UNIQUE (event_id, user_id);
    -- Ensures a user can only be registered once per event
