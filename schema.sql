DROP TABLE simscharachters;

CREATE TABLE IF NOT EXISTS simscharachters
(id SERIAL PRIMARY KEY,
  character VARCHAR(256),
  quote TEXT,
  image TEXT,
  characterdirection VARCHAR(256)
);