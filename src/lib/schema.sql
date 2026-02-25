-- ============================================================
-- Animals Club - Neon PostgreSQL Schema
-- Run this once against your Neon database:
--   psql "postgresql://..." -f src/lib/schema.sql
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  acc_type      VARCHAR(20) CHECK (acc_type IN ('regular', 'provider', 'admin')) DEFAULT 'regular',
  birth_date    DATE,
  email         VARCHAR(255) UNIQUE NOT NULL,
  first_name    VARCHAR(100) NOT NULL,
  gender        VARCHAR(50),
  last_name     VARCHAR(100) NOT NULL,
  location      VARCHAR(255) NOT NULL DEFAULT '',
  coordinates   JSONB,                           -- { "type": "Point", "coordinates": [lng, lat] }
  password      VARCHAR(255) NOT NULL,
  phone         VARCHAR(20) NOT NULL,
  avatar        TEXT,
  boutique_image TEXT,
  bio           TEXT,
  status        VARCHAR(20) CHECK (status IN ('authenticated', 'unauthenticated')) DEFAULT 'unauthenticated',
  -- Provider-specific fields
  business_name  VARCHAR(255),
  business_type  VARCHAR(50) CHECK (business_type IN ('veterinarian', 'trainer', 'groomer', 'shelter', 'daycare', 'shop')),
  services       JSONB    DEFAULT '[]',
  certifications TEXT,
  description    TEXT,
  website        VARCHAR(255),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ANIMALS
-- ============================================================
CREATE TABLE IF NOT EXISTS animals (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  type          VARCHAR(50)  NOT NULL,
  breed         VARCHAR(100) NOT NULL,
  age           VARCHAR(20)  NOT NULL,
  gender        VARCHAR(10)  CHECK (gender IN ('male', 'female', 'other')) NOT NULL,
  weight        VARCHAR(20),
  description   TEXT,
  health_status JSONB DEFAULT '{"vaccinated":false,"neutered":false,"microchipped":false}',
  friendly      JSONB DEFAULT '{"children":false,"dogs":false,"cats":false,"animals":false}',
  image         TEXT,
  lost          BOOLEAN DEFAULT FALSE,
  owner_id      UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  color         VARCHAR(50),
  inmatch       BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_animals_owner ON animals(owner_id);
CREATE INDEX IF NOT EXISTS idx_animals_lost  ON animals(lost);
CREATE INDEX IF NOT EXISTS idx_animals_inmatch ON animals(inmatch);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  description   TEXT NOT NULL,
  price         NUMERIC(10,2) NOT NULL,
  images        JSONB   DEFAULT '[]',
  category      VARCHAR(100) NOT NULL,
  localisation  VARCHAR(255),
  featured      BOOLEAN NOT NULL DEFAULT FALSE,
  pet_type      VARCHAR(100) NOT NULL,
  quantity      INTEGER NOT NULL DEFAULT 1,
  specifications JSONB  DEFAULT '[]',
  breed         VARCHAR(100),
  age           VARCHAR(20),
  gender        VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  weight        VARCHAR(20),
  health_status JSONB DEFAULT '{"vaccinated":false,"neutered":false,"microchipped":false}',
  friendly      JSONB DEFAULT '{"children":false,"dogs":false,"cats":false,"animals":false}',
  color         VARCHAR(50),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  listing_type  VARCHAR(20) CHECK (listing_type IN ('sale', 'adoption')) DEFAULT 'sale',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_user      ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category  ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_pet_type  ON products(pet_type);
CREATE INDEX IF NOT EXISTS idx_products_listing   ON products(listing_type);

-- ============================================================
-- FAVORITES
-- ============================================================
CREATE TABLE IF NOT EXISTS favorites (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES users(id)    ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user    ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product ON favorites(product_id);

-- ============================================================
-- PRODUCT REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stars      INTEGER CHECK (stars >= 1 AND stars <= 5) NOT NULL,
  message    TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id    UUID REFERENCES users(id)    ON DELETE CASCADE NOT NULL,
  photo      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user    ON reviews(user_id);

-- ============================================================
-- SWIPE ACTIONS (Matchy)
-- ============================================================
CREATE TABLE IF NOT EXISTS swipe_actions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  swiper_id     UUID REFERENCES users(id)   ON DELETE CASCADE NOT NULL,
  swiperpet_id  UUID REFERENCES animals(id) ON DELETE CASCADE NOT NULL,
  swipedpet_id  UUID REFERENCES animals(id) ON DELETE CASCADE NOT NULL,
  action_type   VARCHAR(20) CHECK (action_type IN ('like', 'superlike', 'ignore')) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(swiperpet_id, swipedpet_id)
);

CREATE INDEX IF NOT EXISTS idx_swipes_swiperpet ON swipe_actions(swiperpet_id);
CREATE INDEX IF NOT EXISTS idx_swipes_swipedpet ON swipe_actions(swipedpet_id);

-- ============================================================
-- MATCHES (Matchy)
-- ============================================================
CREATE TABLE IF NOT EXISTS matches (
  id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet1_id   UUID REFERENCES animals(id) ON DELETE CASCADE NOT NULL,
  pet2_id   UUID REFERENCES animals(id) ON DELETE CASCADE NOT NULL,
  owner1_id UUID REFERENCES users(id)   ON DELETE CASCADE NOT NULL,
  owner2_id UUID REFERENCES users(id)   ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pet1_id, pet2_id)
);

CREATE INDEX IF NOT EXISTS idx_matches_pet1   ON matches(pet1_id);
CREATE INDEX IF NOT EXISTS idx_matches_pet2   ON matches(pet2_id);
CREATE INDEX IF NOT EXISTS idx_matches_owner1 ON matches(owner1_id);
CREATE INDEX IF NOT EXISTS idx_matches_owner2 ON matches(owner2_id);

-- ============================================================
-- MESSAGES (Matchy chat)
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id   UUID REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  sender_id  UUID REFERENCES users(id)   ON DELETE CASCADE NOT NULL,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_match  ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);

-- ============================================================
-- LIKES (Pet likes)
-- ============================================================
CREATE TABLE IF NOT EXISTS likes (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  petliker_id  UUID REFERENCES animals(id) ON DELETE CASCADE NOT NULL,
  petliked_id  UUID REFERENCES animals(id) ON DELETE CASCADE NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(petliker_id, petliked_id)
);

-- ============================================================
-- RECOVER TOKENS (Password reset)
-- ============================================================
CREATE TABLE IF NOT EXISTS recover_tokens (
  id     UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email  VARCHAR(255) NOT NULL,
  digits VARCHAR(10)  NOT NULL,
  date   TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recover_email ON recover_tokens(email);

-- ============================================================
-- RESERVATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS reservations (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id         UUID REFERENCES users(id)   ON DELETE CASCADE NOT NULL,
  provider_id         UUID REFERENCES users(id)   ON DELETE CASCADE NOT NULL,
  pet_id              UUID REFERENCES animals(id) ON DELETE SET NULL,
  date                TIMESTAMPTZ NOT NULL,
  time_slot           JSONB DEFAULT '[]',
  status              VARCHAR(20) CHECK (status IN ('pending','confirmed','completed','cancelled','no-show')) DEFAULT 'pending',
  notes               TEXT DEFAULT '',
  cancellation_reason TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservations_customer ON reservations(customer_id);
CREATE INDEX IF NOT EXISTS idx_reservations_provider ON reservations(provider_id);
CREATE INDEX IF NOT EXISTS idx_reservations_date     ON reservations(date);

-- ============================================================
-- SERVICE REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS service_reviews (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id    UUID REFERENCES users(id)        ON DELETE CASCADE NOT NULL,
  provider_id    UUID REFERENCES users(id)        ON DELETE CASCADE NOT NULL,
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE NOT NULL,
  rating         INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment        TEXT NOT NULL,
  images         JSONB DEFAULT '[]',
  is_visible     BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_service_reviews_provider ON service_reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_service_reviews_customer ON service_reviews(customer_id);

-- ============================================================
-- APPOINTMENTS (Provider availability)
-- ============================================================
CREATE TABLE IF NOT EXISTS appointments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  date        DATE NOT NULL,
  times       JSONB DEFAULT '[]',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider_id, date)
);

CREATE INDEX IF NOT EXISTS idx_appointments_provider ON appointments(provider_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date     ON appointments(date);

-- ============================================================
-- FOUND / LOST ANIMALS
-- ============================================================
CREATE TABLE IF NOT EXISTS found_lost_animals (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  color       VARCHAR(50),
  image       TEXT,
  description TEXT,
  breed       VARCHAR(100),
  gender      VARCHAR(10),
  type        VARCHAR(50),
  reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_found_animals_type ON found_lost_animals(type);
