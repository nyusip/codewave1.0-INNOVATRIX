// Backend server for Virtual Travel Assistant
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, use environment variable

// In-memory user database (replace with a real database in production)
let users = [];

// Sample user for demo purposes
users.push({
    id: '1234567890',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: '$2a$10$XQCg1z4YSl5K1fZqufz8UeVjMWnLp.ZMyNDtP9A/TIlVzKl/Jxmwe', // hashed 'password123'
    createdAt: new Date(),
    phone: '+1 (555) 123-4567',
    bio: 'Travel enthusiast and adventure seeker. Always looking for the next destination to explore!',
    wishlist: [
        {
            id: 'w1',
            destination: 'Bali, Indonesia',
            notes: 'Visit the rice terraces and temples'
        },
        {
            id: 'w2',
            destination: 'Santorini, Greece',
            notes: 'Watch the sunset in Oia'
        }
    ],
    travelHistory: [
        {
            id: 'h1',
            destination: 'Tokyo, Japan',
            dates: 'May 2023',
            notes: 'Amazing food and culture!'
        },
        {
            id: 'h2',
            destination: 'Paris, France',
            dates: 'September 2022',
            notes: 'Visited the Eiffel Tower and Louvre'
        }
    ],
    addresses: [
        {
            id: 'a1',
            label: 'Home',
            street: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            zip: '94105',
            country: 'United States'
        }
    ]
});

// Routes

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'signin.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/booking', (req, res) => {
    res.sendFile(path.join(__dirname, 'booking.html'));
});

// API Routes

// User Registration
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validate input
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            firstName,
            lastName,
            email,
            password: hashedPassword,
            createdAt: new Date()
        };

        // Save user to database
        users.push(newUser);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// User Login
app.post('/api/auth/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user
        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// Protected route example
app.get('/api/user/profile', authenticateToken, (req, res) => {
    // Find user by ID from token
    const user = users.find(user => user.id === req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Return user data (excluding password)
    const { password, ...userData } = user;
    res.json(userData);
});

// Update user profile
app.put('/api/user/profile', authenticateToken, (req, res) => {
    try {
        // Find user by ID from token
        const userIndex = users.findIndex(user => user.id === req.user.id);
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { firstName, lastName, email, phone, bio } = req.body;

        // Update user data
        users[userIndex] = {
            ...users[userIndex],
            firstName: firstName || users[userIndex].firstName,
            lastName: lastName || users[userIndex].lastName,
            email: email || users[userIndex].email,
            phone: phone || users[userIndex].phone,
            bio: bio || users[userIndex].bio,
            updatedAt: new Date()
        };

        // Return updated user data (excluding password)
        const { password, ...userData } = users[userIndex];
        res.json(userData);
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Server error during profile update' });
    }
});

// Wishlist routes

// Get all wishlist items
app.get('/api/user/wishlist', authenticateToken, (req, res) => {
    const user = users.find(user => user.id === req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.wishlist || []);
});

// Add wishlist item
app.post('/api/user/wishlist', authenticateToken, (req, res) => {
    try {
        const userIndex = users.findIndex(user => user.id === req.user.id);
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { destination, notes } = req.body;
        if (!destination) {
            return res.status(400).json({ message: 'Destination is required' });
        }

        const newItem = {
            id: Date.now().toString(),
            destination,
            notes: notes || '',
            createdAt: new Date()
        };

        // Initialize wishlist array if it doesn't exist
        if (!users[userIndex].wishlist) {
            users[userIndex].wishlist = [];
        }

        users[userIndex].wishlist.push(newItem);
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Wishlist add error:', error);
        res.status(500).json({ message: 'Server error adding wishlist item' });
    }
});

// Delete wishlist item
app.delete('/api/user/wishlist/:id', authenticateToken, (req, res) => {
    try {
        const userIndex = users.findIndex(user => user.id === req.user.id);
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        const itemId = req.params.id;
        if (!users[userIndex].wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        const initialLength = users[userIndex].wishlist.length;
        users[userIndex].wishlist = users[userIndex].wishlist.filter(item => item.id !== itemId);

        if (users[userIndex].wishlist.length === initialLength) {
            return res.status(404).json({ message: 'Wishlist item not found' });
        }

        res.json({ message: 'Wishlist item deleted successfully' });
    } catch (error) {
        console.error('Wishlist delete error:', error);
        res.status(500).json({ message: 'Server error deleting wishlist item' });
    }
});

// Travel history routes

// Get all travel history items
app.get('/api/user/history', authenticateToken, (req, res) => {
    const user = users.find(user => user.id === req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.travelHistory || []);
});

// Add travel history item
app.post('/api/user/history', authenticateToken, (req, res) => {
    try {
        const userIndex = users.findIndex(user => user.id === req.user.id);
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { destination, dates, notes } = req.body;
        if (!destination) {
            return res.status(400).json({ message: 'Destination is required' });
        }

        const newItem = {
            id: Date.now().toString(),
            destination,
            dates: dates || '',
            notes: notes || '',
            createdAt: new Date()
        };

        // Initialize travel history array if it doesn't exist
        if (!users[userIndex].travelHistory) {
            users[userIndex].travelHistory = [];
        }

        users[userIndex].travelHistory.push(newItem);
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Travel history add error:', error);
        res.status(500).json({ message: 'Server error adding travel history item' });
    }
});

// Delete travel history item
app.delete('/api/user/history/:id', authenticateToken, (req, res) => {
    try {
        const userIndex = users.findIndex(user => user.id === req.user.id);
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        const itemId = req.params.id;
        if (!users[userIndex].travelHistory) {
            return res.status(404).json({ message: 'Travel history not found' });
        }

        const initialLength = users[userIndex].travelHistory.length;
        users[userIndex].travelHistory = users[userIndex].travelHistory.filter(item => item.id !== itemId);

        if (users[userIndex].travelHistory.length === initialLength) {
            return res.status(404).json({ message: 'Travel history item not found' });
        }

        res.json({ message: 'Travel history item deleted successfully' });
    } catch (error) {
        console.error('Travel history delete error:', error);
        res.status(500).json({ message: 'Server error deleting travel history item' });
    }
});

// Address routes

// Get all addresses
app.get('/api/user/addresses', authenticateToken, (req, res) => {
    const user = users.find(user => user.id === req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.addresses || []);
});

// Add address
app.post('/api/user/addresses', authenticateToken, (req, res) => {
    try {
        const userIndex = users.findIndex(user => user.id === req.user.id);
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { label, street, city, state, zip, country } = req.body;
        if (!street || !city || !country) {
            return res.status(400).json({ message: 'Street, city, and country are required' });
        }

        const newAddress = {
            id: Date.now().toString(),
            label: label || 'Address',
            street,
            city,
            state: state || '',
            zip: zip || '',
            country,
            createdAt: new Date()
        };

        // Initialize addresses array if it doesn't exist
        if (!users[userIndex].addresses) {
            users[userIndex].addresses = [];
        }

        users[userIndex].addresses.push(newAddress);
        res.status(201).json(newAddress);
    } catch (error) {
        console.error('Address add error:', error);
        res.status(500).json({ message: 'Server error adding address' });
    }
});

// Delete address
app.delete('/api/user/addresses/:id', authenticateToken, (req, res) => {
    try {
        const userIndex = users.findIndex(user => user.id === req.user.id);
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        const addressId = req.params.id;
        if (!users[userIndex].addresses) {
            return res.status(404).json({ message: 'Addresses not found' });
        }

        const initialLength = users[userIndex].addresses.length;
        users[userIndex].addresses = users[userIndex].addresses.filter(address => address.id !== addressId);

        if (users[userIndex].addresses.length === initialLength) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Address delete error:', error);
        res.status(500).json({ message: 'Server error deleting address' });
    }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Authentication token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to access the application`);
});