# AI-Powered Conversational Flight Booking Platform (MERN + Bot)

## Features

- **Conversational Search:** Interact with a chatbot in natural language to specify travel needs (origin, destination, dates, travelers, etc.).
- **Real-time Flight Search:** Access live flight data from multiple airlines (Amadeus API) for up-to-date prices and availability.
- **Price Comparison:** Compare fares across airlines and travel classes.
- **Advanced Flight Filtering:** Filter by price, airline, travel duration, layovers, and more (via UI or chat).
- **Secure Booking:** Book flights directly through the bot or UI using Stripe for secure payments.
- **Confirmation & Itinerary Management:** Receive instant booking confirmation and manage itineraries in the chat and UI.
- **Multilingual Support:** Interact with the bot and UI in multiple languages.

---

## Project Structure

```
Flight/
  backend/
    index.js           # Main Express backend
    models/            # Mongoose models (User, Booking)
    routes/            # API routes (auth, flights, bookings, payment, i18n)
    bot/               # Bot backend (Microsoft Bot Framework + Azure CLU)
      index.js         # Bot entry point
      .env             # Azure CLU credentials
  frontend/
    src/
      pages/           # React pages (Search, Bookings, Login, Register, Chatbot, BookFlight)
      api.js           # API helper
      i18n.js          # i18n config
      App.js           # Main app
      ...
    .env               # Stripe publishable key
```

---

## Setup Instructions

### 1. **Backend**

#### a. Install dependencies
```bash
cd backend
npm install
```

#### b. Environment variables
Create a `.env` file in `backend/`:
```
MONGO_URI=mongodb://localhost:27017/flightapp
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret
```

#### c. Start MongoDB
Make sure MongoDB is running locally or use a cloud URI.

#### d. Start backend server
```bash
node index.js
```

### 2. **Bot Backend**

#### a. Install dependencies
```bash
cd backend/bot
npm install
```

#### b. Environment variables
Create a `.env` file in `backend/bot/`:
```
AZURE_CLU_ENDPOINT=your_azure_clu_endpoint
AZURE_CLU_KEY=your_azure_clu_key
AZURE_CLU_PROJECT=your_clu_project_name
AZURE_CLU_DEPLOYMENT=your_clu_deployment_name
```

#### c. Start bot service
```bash
node index.js
```

### 3. **Frontend**

#### a. Install dependencies
```bash
cd frontend
npm install
```

#### b. Environment variables
Create a `.env` file in `frontend/`:
```
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

#### c. Start frontend
```bash
npm start
```

---

## Usage

1. Register and log in as a user.
2. Use the chatbot to specify your travel needs in natural language (e.g., "I want to fly from Delhi to Paris next Friday for 2 adults").
3. The bot will extract details, auto-fill the search form, and show real-time flight results.
4. Refine your search with advanced filters (e.g., "Show only direct flights under $500").
5. Book a flight directly from the chat (e.g., "Book the first flight") or via the UI.
6. Pay securely with Stripe.
7. Receive instant confirmation and view/manage your itinerary in chat or on the bookings page.
8. Switch languages using the UI language selector.

---

## Technologies Used
- **Frontend:** React, Material-UI, react-i18next, Stripe.js
- **Backend:** Node.js, Express, MongoDB (Mongoose), Amadeus API, Stripe
- **Bot:** Microsoft Bot Framework SDK, Azure Conversational Language Understanding (CLU)

---



## License
MIT 