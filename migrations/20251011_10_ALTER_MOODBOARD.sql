ALTER TABLE mood_board_entr
    ADD COLUMN user_id INTEGER;

ALTER TABLE mood_board_entr
    ADD CONSTRAINT completed
    FOREIGN KEY (user_id)
    REFERENCES users (id);