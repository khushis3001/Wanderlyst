# ✦ Wanderlyst

### Travel plans with personality.

Wanderlyst is a full-stack travel planning web application designed to turn a travel idea into a personalized journey.

Instead of simply searching for destinations, Wanderlyst brings together **trip planning, budgeting, weather information, interactive maps and saved journeys** in one place.

---

## 🌍 What is Wanderlyst?

Planning a trip often means switching between multiple websites for destinations, budgets, weather, maps and itineraries.

Wanderlyst brings these experiences together into a single platform.

Users can:

- 📍 Choose a destination
- 📅 Select travel dates
- 👥 Set the number of travellers
- 💰 Define their travel budget
- ❤️ Select their interests
- ✦ Choose a travel style
- 🌦️ View weather information
- 🗺️ Explore their destination using an interactive map
- 💸 View a detailed budget breakdown
- 💾 Save their journeys
- 🗑️ Delete saved journeys
- 🔐 Create an account and sign in

---

## ✨ Key Features

### 🧭 Personalized Trip Planner

Users provide basic information about their journey:

- Destination
- Departure and return dates
- Number of travellers
- Total budget
- Interests
- Travel style

The application processes these inputs and generates a structured trip overview.

---

### 💰 Smart Budget Planner

Wanderlyst automatically divides the total travel budget into different categories.

| Category | Allocation |
|---|---:|
| Accommodation | 35% |
| Transport | 25% |
| Food | 15% |
| Activities | 15% |
| Emergency / Miscellaneous | 10% |

The allocation is dynamically calculated according to the user's total budget.

---

### 🌦️ Weather Information

The selected destination can be connected with weather data to provide users with useful information about conditions during their journey.

This helps users understand what kind of weather they may encounter before travelling.

---

### 🗺️ Interactive Destination Map

Wanderlyst includes an interactive map experience for the selected destination.

Users can explore the destination and open the location directly in a mapping service.

---

### 🔐 Authentication

User authentication is implemented using **Supabase Authentication**.

Users can:

- Create an account
- Sign in
- Maintain an authenticated session
- Associate their travel information with their account

---

### 💾 Saved Journeys

Users can save their planned journeys and access them later through **My Trips**.

Saved trips contain information such as:

- Destination
- Budget
- Travellers
- Dates
- Interests
- Travel style
- Trip duration

Users can also delete journeys they no longer need.

---

## 🏗️ Technical Architecture

```text
                    WANDERLYST
                         │
             ┌───────────┴───────────┐
             │                       │
        FRONTEND                  BACKEND
             │                       │
      HTML + CSS + JS             Supabase
             │                       │
             │             ┌─────────┴─────────┐
             │             │                   │
             │       Authentication       PostgreSQL
             │                                 │
             └──────────────┬──────────────────┘
                            │
                     External APIs
                            │
                    Weather / Maps
