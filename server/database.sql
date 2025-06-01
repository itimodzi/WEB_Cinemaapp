-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables in correct order
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS showtimes CASCADE;
DROP TABLE IF EXISTS hallschemes CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL UNIQUE CHECK (user_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    user_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create movies table
CREATE TABLE movies (
    movie_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    movie_title VARCHAR(255) NOT NULL,
    movie_description TEXT NOT NULL,
    image_url TEXT NOT NULL CHECK (image_url ~ '^https?://'),
    back_image_url TEXT NOT NULL CHECK (back_image_url ~ '^https?://'),
    movie_duration INTEGER NOT NULL CHECK (movie_duration > 0),
    movie_director VARCHAR(100) NOT NULL,
    movie_genre TEXT[] NOT NULL,
    release_date DATE NOT NULL,
    end_date DATE NOT NULL CHECK (end_date >= release_date),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create hallschemes table
CREATE TABLE hallschemes (
    hallscheme_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    hall_name VARCHAR(100) NOT NULL UNIQUE,
    seats INTEGER[][] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_seats CHECK (array_length(seats, 1) > 0 AND array_length(seats, 2) > 0)
);

-- Create showtimes table
CREATE TABLE showtimes (
    showtime_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_price INTEGER NOT NULL CHECK (ticket_price > 0),
    start_at TIME NOT NULL,
    show_date DATE NOT NULL,
    movie_id uuid NOT NULL REFERENCES movies(movie_id) ON DELETE CASCADE,
    hallscheme_id uuid NOT NULL REFERENCES hallschemes(hallscheme_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(show_date, start_at, hallscheme_id)
);

-- Create reservations table
CREATE TABLE reservations (
    reservation_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    showtime_id uuid NOT NULL REFERENCES showtimes(showtime_id) ON DELETE CASCADE,
    booked_seats INTEGER[][] NOT NULL,
    reservation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total INTEGER NOT NULL CHECK (total > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

-- Create payments table
CREATE TABLE payments (
    payment_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    reservation_id uuid NOT NULL REFERENCES reservations(reservation_id) ON DELETE CASCADE,
    amount INTEGER NOT NULL CHECK (amount > 0),
    pmethod VARCHAR(32) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    pdatetime TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    transaction_id TEXT
);

-- Insert initial data
WITH movie_insert AS (
    INSERT INTO movies (
        movie_title,
        movie_description,
        image_url,
        back_image_url,
        movie_duration,
        movie_director,
        movie_genre,
        release_date,
        end_date
    ) VALUES (
        'Spider-Man: No Way Home',
        'After Peter Parker''s identity as Spider-Man is exposed, he asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds appear, forcing Peter to discover what it truly means to be Spider-Man.',
        'https://www.themoviedb.org/t/p/original/VlHt27nCqOuTnuX6bku8QZapzO.jpg',
        'https://www.themoviedb.org/t/p/original/VlHt27nCqOuTnuX6bku8QZapzO.jpg',
        148,
        'Jon Watts',
        ARRAY['Action', 'Adventure', 'Science Fiction', 'Fantasy'],
        '2021-12-15',
        '2022-01-15'
    ) RETURNING movie_id
),
hall_insert AS (
    INSERT INTO hallschemes (hall_name, seats) VALUES 
    ('Hall 1', ARRAY[
        [3,3,3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3,3,3,3],
        [3,3,3,3,3,3,3,3,3,3],
        [4,4,3,3,3,3,3,3,4,4]
    ]) RETURNING hallscheme_id
)
-- Insert showtimes for the next 7 days
INSERT INTO showtimes (
    ticket_price,
    start_at,
    show_date,
    movie_id,
    hallscheme_id
)
SELECT 
    500,  -- ticket price
    time::TIME,  -- start time
    CURRENT_DATE + i,  -- show date
    (SELECT movie_id FROM movie_insert),  -- movie reference
    (SELECT hallscheme_id FROM hall_insert)  -- hall reference
FROM 
    generate_series(0, 7) i,
    unnest(ARRAY['10:00', '13:00', '16:00', '19:00', '22:00']) time;

INSERT INTO movies ( movie_title,
                    movie_description,
                    image_url,
                    back_image_url,
                    movie_duration,
                    movie_director,
                    movie_genre,
                    release_date,
                    end_date )
 VALUES ('Matrix',
         'The continuation of the story told in the first film "MATRIX", reuniting the cinematic pictures of Neo and Trinity, when they go back to the Matrix and even deeper into the rabbit hole. An exciting new adventure with action and an epic scale, the action of which unfolds in a familiar, but even more provocative world, where reality is more subjective than ever, and all that is required to see the truth is to free your mind.',
         'https://www.themoviedb.org/t/p/original/3NiiRAKt2L5bUuAvSOkv6Yn7u6T.jpg',
         'https://www.themoviedb.org/t/p/original/gespPE81A2RYvMxl9XaVNvIgevS.jpg',
          148,
         'Lana Wachkowski',
          ARRAY['Action','Science Fiction', 'Fantasy'],
         '2021-12-15 00:00:00-07',
         '2022-01-01 00:00:00-07'
        );RETURNING movie_id
        
 INSERT INTO movies ( movie_title,
                    movie_description,
                    image_url,
                    back_image_url,
                    movie_duration,
                    movie_director,
                    movie_genre,
                    release_date,
                    end_date )
 VALUES ('Gucci house',
         'The last name Gucci sounded so sweet, so seductive. A synonym of luxury, style, power. But she was their curse. A shocking story of love, betrayal, fall and revenge, which led to a brutal murder in one of the most famous fashion empires in the world.',
         'https://www.themoviedb.org/t/p/original/6VZF8JVNOgJX56WCapYaqcVQiAw.jpg',
         'https://www.themoviedb.org/t/p/original/ivSzkIRjPx7HQ0Jt1PR6hf6mM9w.jpg',
          150,
         'Ridley Scott',
          ARRAY['Action','Science Fiction', 'Fantasy'],
         '2021-12-15 00:00:00-07',
         '2022-01-01 00:00:00-07'
         );RETURNING movie_id
 

INSERT INTO hallschemes (
  hall_name,
  seats )
 VALUES ('Second', '{
                    {3,3,3,3,3,3,3,3,3,3},
                    {3,3,3,3,3,3,3,3,3,3},
                    {3,3,3,3,3,3,3,3,3,3},
                    {3,3,3,3,3,3,3,3,3,3},
                    {3,3,3,3,3,3,3,3,3,3},
                    {3,3,3,3,3,3,3,3,3,3},
                    {3,3,3,3,3,3,3,3,3,3},
                    {3,3,3,3,3,3,3,3,3,3},
                    {3,3,3,3,3,3,3,3,3,3}}');

 INSERT INTO hallschemes (
  hall_name,
  seats )
 VALUES ('Third', '{
                    {3,3,3,3,3,3,3,3,3,3},
                    {3,3,3,3,3,3,3,3,3,3},
                    {3,3,3,3,3,3,3,3,3,3},
                    {3,3,3,3,3,3,3,3,3,3},
                    {3,3,3,3,3,3,3,3,3,3},
                    {3,3,3,3,3,3,3,3,3,3},
                    {3,3,3,3,3,3,3,3,3,3},
                    {3,3,3,3,3,3,3,3,3,3},
                    {3,3,3,3,3,3,3,3,3,3}}');

