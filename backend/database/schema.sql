-- =====================================================
-- WANDERLYST DATABASE SCHEMA
-- Supabase / PostgreSQL
-- =====================================================


-- =====================================================
-- PROFILES
-- Stores additional information about authenticated users
-- =====================================================

create table if not exists public.profiles (

    id uuid primary key references auth.users(id)
        on delete cascade,

    full_name text,

    email text,

    avatar_url text,

    created_at timestamptz
        default now(),

    updated_at timestamptz
        default now()

);


-- =====================================================
-- TRIPS
-- Stores the user's travel plans
-- =====================================================

create table if not exists public.trips (

    id uuid primary key
        default gen_random_uuid(),

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    destination text not null,

    from_location text,

    departure_date date not null,

    return_date date not null,

    travelers integer
        default 1,

    budget text
        default 'moderate',

    interests text[],

    created_at timestamptz
        default now(),

    updated_at timestamptz
        default now()

);


-- =====================================================
-- ITINERARY DAYS
-- Stores each day of a trip
-- =====================================================

create table if not exists public.itinerary_days (

    id uuid primary key
        default gen_random_uuid(),

    trip_id uuid not null
        references public.trips(id)
        on delete cascade,

    day_number integer not null,

    travel_date date,

    title text,

    image_url text,

    schedule text,

    food text,

    transport text,

    created_at timestamptz
        default now()

);


-- =====================================================
-- PLACES
-- Places to visit on each itinerary day
-- =====================================================

create table if not exists public.itinerary_places (

    id uuid primary key
        default gen_random_uuid(),

    itinerary_day_id uuid not null
        references public.itinerary_days(id)
        on delete cascade,

    place_name text not null,

    description text,

    visit_order integer
        default 1,

    created_at timestamptz
        default now()

);


-- =====================================================
-- STAYS
-- Hotel/accommodation information
-- =====================================================

create table if not exists public.stays (

    id uuid primary key
        default gen_random_uuid(),

    itinerary_day_id uuid not null
        references public.itinerary_days(id)
        on delete cascade,

    hotel_name text not null,

    price_per_night numeric,

    created_at timestamptz
        default now()

);


-- =====================================================
-- INDEXES
-- Improve database lookup performance
-- =====================================================

create index if not exists trips_user_id_idx
on public.trips(user_id);


create index if not exists itinerary_days_trip_id_idx
on public.itinerary_days(trip_id);


create index if not exists itinerary_places_day_id_idx
on public.itinerary_places(itinerary_day_id);


create index if not exists stays_day_id_idx
on public.stays(itinerary_day_id);


-- =====================================================
-- ROW LEVEL SECURITY
-- Users should only access their own trips
-- =====================================================

alter table public.profiles
enable row level security;

alter table public.trips
enable row level security;

alter table public.itinerary_days
enable row level security;

alter table public.itinerary_places
enable row level security;

alter table public.stays
enable row level security;


-- =====================================================
-- PROFILE POLICIES
-- =====================================================

create policy "Users can view their own profile"

on public.profiles

for select

using (
    auth.uid() = id
);


create policy "Users can update their own profile"

on public.profiles

for update

using (
    auth.uid() = id
);


-- =====================================================
-- TRIP POLICIES
-- =====================================================

create policy "Users can view their own trips"

on public.trips

for select

using (
    auth.uid() = user_id
);


create policy "Users can create their own trips"

on public.trips

for insert

with check (
    auth.uid() = user_id
);


create policy "Users can update their own trips"

on public.trips

for update

using (
    auth.uid() = user_id
);


create policy "Users can delete their own trips"

on public.trips

for delete

using (
    auth.uid() = user_id
);


-- =====================================================
-- ITINERARY DAY POLICIES
-- =====================================================

create policy "Users can view their itinerary days"

on public.itinerary_days

for select

using (

    exists (

        select 1

        from public.trips

        where trips.id = itinerary_days.trip_id

        and trips.user_id = auth.uid()

    )

);


create policy "Users can create itinerary days"

on public.itinerary_days

for insert

with check (

    exists (

        select 1

        from public.trips

        where trips.id = itinerary_days.trip_id

        and trips.user_id = auth.uid()

    )

);


create policy "Users can update itinerary days"

on public.itinerary_days

for update

using (

    exists (

        select 1

        from public.trips

        where trips.id = itinerary_days.trip_id

        and trips.user_id = auth.uid()

    )

);


create policy "Users can delete itinerary days"

on public.itinerary_days

for delete

using (

    exists (

        select 1

        from public.trips

        where trips.id = itinerary_days.trip_id

        and trips.user_id = auth.uid()

    )

);


-- =====================================================
-- ITINERARY PLACE POLICIES
-- =====================================================

create policy "Users can view itinerary places"

on public.itinerary_places

for select

using (

    exists (

        select 1

        from public.itinerary_days
        join public.trips
        on trips.id = itinerary_days.trip_id

        where itinerary_days.id =
              itinerary_places.itinerary_day_id

        and trips.user_id = auth.uid()

    )

);


-- =====================================================
-- STAY POLICIES
-- =====================================================

create policy "Users can view their stays"

on public.stays

for select

using (

    exists (

        select 1

        from public.itinerary_days

        join public.trips
        on trips.id = itinerary_days.trip_id

        where itinerary_days.id =
              stays.itinerary_day_id

        and trips.user_id = auth.uid()

    )

);