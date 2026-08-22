# ✈️ Wanderlyst

### Explore More, Worry Less.

Wanderlyst is a responsive travel planning web application designed to make trip planning simple, organized, and enjoyable.

From choosing a destination to creating a day-by-day itinerary, Wanderlyst brings the important parts of a trip together in one place.

---

## 🌍 About Wanderlyst

Planning a trip often means searching across multiple websites for destinations, activities, food, transportation, and accommodation.

Wanderlyst aims to simplify this process by allowing users to enter their travel preferences and generate an organized travel plan.

The application provides a structured itinerary containing:

- 📍 Places to visit
- 🏨 Accommodation suggestions
- 🍴 Food recommendations
- 🚗 Transportation suggestions
- 📅 Day-by-day activities
- 🗺️ Travel planning information

---

# ✨ Features

## 🔐 Login

- Responsive login interface
- Email and password fields
- Password visibility toggle
- Remember-me option
- Forgot-password interaction
- Frontend validation

> Authentication is currently frontend-based. Supabase authentication is planned for the next backend integration stage.

---

## 🗺️ Trip Planning

Users can provide:

- Starting location
- Destination
- Travel dates
- Number of travelers
- Budget preference
- Travel interests

The information is then used to create a personalized travel plan.

---

## 📅 Dynamic Itinerary

Wanderlyst creates a structured travel itinerary with:

- Day-by-day schedule
- Places to visit
- Activities
- Food suggestions
- Transportation
- Accommodation
- Destination images

---

## 🏨 Stay Planning

The itinerary includes accommodation information so users can see:

- Where to stay
- Suggested hotel
- Approximate price per night
- Which part of the trip the accommodation belongs to

---

## 🍴 Food & Transport

The travel plan also provides suggestions for:

- Local food
- Restaurants and food experiences
- Local transportation
- Travel between destinations

---

## 📱 Responsive Design

Wanderlyst is designed to work across different screen sizes:

- 💻 Desktop
- 💻 Laptop
- 📱 Mobile
- 📲 Tablet

---

# 🛠️ Technology Stack

## Frontend

- HTML5
- CSS3
- JavaScript
- Font Awesome
- Google Fonts

## Current Data Storage

- Browser LocalStorage

## Backend Architecture

The project contains a backend structure prepared for Supabase integration.

- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security
- Database schema
- Service-layer architecture

> The Supabase connection is not yet active in the current version.

---

# 🏗️ Project Structure

```text
Wanderlyst/
│
├── backend/
│   │
│   ├── config/
│   │   └── supabase.example.js
│   │
│   ├── database/
│   │   └── schema.sql
│   │
│   └── services/
│       ├── auth.js
│       ├── trips.js
│       └── users.js
│
├── index.html
├── planning.html
├── itinerary.html
├── script.js
├── style.css
├── README.md
└── .gitignore
