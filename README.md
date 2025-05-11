# 🌅 Sunrise Sunset App

This is a full-stack application built with Ruby (Sinatra) and React, designed to display sunrise, sunset and golden hour times for a given location and date range.


---

## ⚙️ Tech Stack

- **Backend**: Ruby + Sinatra (API server)
- **Frontend**: React + Vite + Chart.js
- **Reverse Proxy**: Nginx
- **Database**: SQLite
- **Geocoding**: Ruby Geocoder gem
- **API Source**: [Sunrise-Sunset API](https://api.sunrisesunset.io/json)

---

## 🚀 Features

- Input a **location**, **start date**, and **end date**
- Displays:
  - Sunrise time
  - Sunset time
  - Golden hour
- Visualized via:
  - Chart.js (line + floating bar chart)
  - Table format
- Stores data locally to **minimize API calls**
- Handles edge cases like `"N/A"` for polar regions or API errors
- Fully containerized with **Docker & Nginx** reverse proxy

---

## 📦 Run with Docker

> Make sure Docker & Docker Compose are installed on your machine.

### 🔧 1. Clone the repository

```bash
git clone https://github.com/ullahe/sunrise-sunset-app.git
cd sunrise-sunset-app
```

### ▶️ 2. Start all services

```bash
docker-compose up --build
```

This will:
- Build and run the **Ruby API backend** (`/api/sun`)
- Build the **React frontend** (served as static files)
- Serve everything via **Nginx** on port **80**

---

## 🌍 Access the App

Once running, open your browser at:

```
http://localhost:5173
```
---

## 📂 Project Structure

```
.
├── backend/                # Sinatra Ruby API
├── frontend/               # React + Vite frontend
├── nginx/                  # Nginx config and static mounting
├── docker-compose.yml      # Full stack orchestration
└── README.md
```

---

## 🧪 API Endpoint

The backend exposes the following API:

```
GET /api/sun?location=Lisbon&start=2025-05-01&end=2025-05-03
```

Returns:
```json
[
  {
    "date": "2025-05-01",
    "sunrise": "6:23:44 AM",
    "sunset": "8:21:32 PM",
    "golden_hour": "7:31:22 PM"
  },
  ...
]
```

---

## 🛡️ Error Handling

- Invalid locations → User-friendly message
- Sunrise/Sunset unavailable → `"N/A"` in table & chart skipped
- API downtime → Fallback & frontend notification

---

## ✅ To-Do / Improvements

- Add unit tests
- Persistent DB volume
- Caching


