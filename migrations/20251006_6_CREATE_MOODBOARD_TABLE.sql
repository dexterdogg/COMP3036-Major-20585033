CREATE TABLE IF NOT EXISTS mood_board_entr (
    entry_id SERIAL PRIMARY KEY,
    mood VARCHAR(255) NOT NULL,
    notes TEXT,
    submitted_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_moodboard_name ON mood_board_entr(mood);