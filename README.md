# Virtual Travel Assistant - Instant AI Trip Planner

## Overview

Virtual Travel Assistant is an AI-powered tool that creates personalized, day-by-day travel itineraries in seconds. Users can create accounts, sign in, and generate custom travel plans by inputting their destination, trip duration, budget, and interests.

## Features

- **User Authentication**: Create accounts and sign in securely
- **Personalized Itineraries**: Generate custom travel plans based on user preferences
- **Destination Insights**: Discover top attractions and hidden gems
- **Local Recommendations**: Get tips on restaurants, cafés, and local experiences
- **Travel Guidance**: Access information on transportation, weather, and safety
- **Mobile-Friendly Design**: Access your itinerary on any device
- **Secure Backend**: Node.js/Express backend with JWT authentication

## Project Structure

```
travel2/
├── index.html          # Main HTML file
├── signin.html         # Sign in page
├── signup.html         # Sign up page
├── styles.css          # Main CSS styles
├── auth.css            # Authentication pages styles
├── script.js           # Main JavaScript functionality
├── auth.js             # Authentication JavaScript functionality
├── server.js           # Express backend server
├── package.json        # Node.js dependencies
├── .env                # Environment variables (not tracked in git)
├── .gitignore          # Git ignore file
├── images/             # SVG images for the website
│   ├── hero-bg.svg     # Hero section background
│   ├── paris.svg       # Paris destination image
│   ├── tokyo.svg       # Tokyo destination image
│   ├── newyork.svg     # New York destination image
│   └── bali.svg        # Bali destination image
└── README.md           # Project documentation
```

## Usage

### Running the Application

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

3. Visit `http://localhost:3000` in your browser

### Using the Application

1. Create an account or sign in
2. Enter your destination, travel dates, and preferences
3. Select your interests from the available tags
4. Click "Create Itinerary" to generate your personalized travel plan

## Development

This project uses:
- Frontend: HTML, CSS, and JavaScript
- Backend: Node.js with Express
- Authentication: JWT (JSON Web Tokens)

To modify or extend the project:

1. Frontend:
   - Edit HTML files to change the structure
   - Modify CSS files to update the appearance
   - Enhance JavaScript files to add new functionality

2. Backend:
   - Modify `server.js` to add new API endpoints
   - Update authentication logic in the API routes

3. For development mode with auto-restart:
   ```
   npm run dev
   ```

## Future Enhancements

- Integration with real travel APIs for live data
- Database integration (MongoDB, PostgreSQL) for persistent storage
- Enhanced user profiles with travel preferences
- Social sharing capabilities
- Offline access to saved itineraries
- Integration with maps and navigation
- Password reset functionality
- OAuth integration for social login

## Credits

Design inspired by the Acenda booking website Figma template.