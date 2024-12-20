/*
  # Create Carpooling Schema

  1. New Tables
    - `carpools`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `date` (date, when the carpool is scheduled)
      - `start_location` (text, starting point)
      - `destination` (text, end point)
      - `mobile_number` (text, driver's contact)
      - `id_type` (text, type of ID provided)
      - `id_number` (text, ID number)
      - `available_seats` (integer, number of seats)
      - `fare` (decimal, cost per seat)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on carpools table
    - Allow authenticated users to create carpools
    - Allow anyone to read carpools
    - Allow users to update/delete their own carpools
*/

CREATE TABLE carpools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  start_location text NOT NULL,
  destination text NOT NULL,
  mobile_number text NOT NULL,
  id_type text NOT NULL,
  id_number text NOT NULL,
  available_seats integer NOT NULL CHECK (available_seats >= 0),
  fare decimal NOT NULL CHECK (fare >= 0),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_id_type CHECK (id_type IN ('Aadhaar', 'PAN', 'Driving License', 'Passport'))
);

ALTER TABLE carpools ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read carpools
CREATE POLICY "Carpools are viewable by everyone" ON carpools
  FOR SELECT USING (true);

-- Allow authenticated users to create carpools
CREATE POLICY "Users can create carpools" ON carpools
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own carpools
CREATE POLICY "Users can update own carpools" ON carpools
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own carpools
CREATE POLICY "Users can delete own carpools" ON carpools
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);