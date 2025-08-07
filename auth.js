// Authentication related JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Sign In Form Handling
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const rememberMe = document.getElementById('remember-me')?.checked || false;
            
            // Validate form
            if (!email || !password) {
                showMessage('signin-message', 'Please fill in all fields', 'error');
                return;
            }
            
            // Email validation
            if (!isValidEmail(email)) {
                showMessage('signin-message', 'Please enter a valid email address', 'error');
                return;
            }
            
            // Send login request to backend
            signIn(email, password, rememberMe);
        });
    }
    
    // Sign Up Form Handling
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const firstName = document.getElementById('first-name').value.trim();
            const lastName = document.getElementById('last-name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirm-password').value.trim();
            const termsAgreed = document.getElementById('terms').checked;
            
            // Validate form
            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                showMessage('signup-message', 'Please fill in all fields', 'error');
                return;
            }
            
            // Email validation
            if (!isValidEmail(email)) {
                showMessage('signup-message', 'Please enter a valid email address', 'error');
                return;
            }
            
            // Password validation
            if (!isValidPassword(password)) {
                showMessage('signup-message', 'Password must be at least 8 characters with a number and a special character', 'error');
                return;
            }
            
            // Password match validation
            if (password !== confirmPassword) {
                showMessage('signup-message', 'Passwords do not match', 'error');
                return;
            }
            
            // Terms agreement validation
            if (!termsAgreed) {
                showMessage('signup-message', 'You must agree to the Terms of Service and Privacy Policy', 'error');
                return;
            }
            
            // Send registration request to backend
            signUp(firstName, lastName, email, password);
        });
    }
    
    // Social Authentication Buttons
    const googleButton = document.querySelector('.btn-google');
    if (googleButton) {
        googleButton.addEventListener('click', function() {
            // Implement Google authentication
            socialSignIn('google');
        });
    }
    
    const facebookButton = document.querySelector('.btn-facebook');
    if (facebookButton) {
        facebookButton.addEventListener('click', function() {
            // Implement Facebook authentication
            socialSignIn('facebook');
        });
    }
});

// Helper Functions

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength
function isValidPassword(password) {
    // At least 8 characters, 1 number, 1 special character
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegex.test(password);
}

// Display message to user
function showMessage(elementId, message, type) {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = 'auth-message ' + type;
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000);
        }
    }
}

// API Functions

// Sign In API call
async function signIn(email, password, rememberMe) {
    try {
        // Show loading state
        showMessage('signin-message', 'Signing in...', 'info');
        
        // In a real application, this would be an actual API call
        const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, rememberMe })
        });
        
        // For demo purposes, simulate a successful response
        // In a real app, you would check response.ok and handle the actual response
        if (true) { // Change this to response.ok in production
            // Store authentication token (from response) in localStorage or sessionStorage
            localStorage.setItem('authToken', 'demo-token-12345');
            
            // Store user data in localStorage for demo purposes
            // In a real app, you would get this from the response
            const userData = {
                id: '1234567890',
                firstName: 'John',
                lastName: 'Doe',
                email: email
            };
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Show success message
            showMessage('signin-message', 'Sign in successful! Redirecting to your profile...', 'success');
            
            // Redirect to profile page after successful login
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1500);
        } else {
            // Handle error response
            showMessage('signin-message', 'Invalid email or password', 'error');
        }
    } catch (error) {
        console.error('Sign in error:', error);
        showMessage('signin-message', 'An error occurred. Please try again.', 'error');
    }
}

// Sign Up API call
async function signUp(firstName, lastName, email, password) {
    try {
        // Show loading state
        showMessage('signup-message', 'Creating your account...', 'info');
        
        // In a real application, this would be an actual API call
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, email, password })
        });
        
        // For demo purposes, simulate a successful response
        // In a real app, you would check response.ok and handle the actual response
        if (true) { // Change this to response.ok in production
            // Show success message
            showMessage('signup-message', 'Account created successfully! Redirecting to sign in...', 'success');
            
            // Redirect to sign in page after successful registration
            setTimeout(() => {
                window.location.href = 'signin.html';
            }, 2000);
        } else {
            // Handle error response
            showMessage('signup-message', 'An error occurred during registration', 'error');
        }
    } catch (error) {
        console.error('Sign up error:', error);
        showMessage('signup-message', 'An error occurred. Please try again.', 'error');
    }
}

// Social Sign In
function socialSignIn(provider) {
    // In a real application, this would redirect to the OAuth provider
    console.log(`Initiating ${provider} sign in`);
    
    // For demo purposes, show a message
    const messageElement = document.getElementById('signin-message') || document.getElementById('signup-message');
    if (messageElement) {
        messageElement.textContent = `${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication is not implemented in this demo`;
        messageElement.className = 'auth-message info';
    }
}