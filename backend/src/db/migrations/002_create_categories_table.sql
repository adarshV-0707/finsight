CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO categories (name)
VALUES
  ('Food'),
  ('Rent'),
  ('Bills'),
  ('Travel'),
  ('Shopping'),
  ('Health'),
  ('Education'),
  ('Entertainment'),
  ('Other');