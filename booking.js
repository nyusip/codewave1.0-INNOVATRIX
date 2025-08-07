// Booking page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize booking page only if we're on the booking page
    if (window.location.pathname.includes('booking.html')) {
        initBookingPage();
    }
});

/**
 * Initialize the booking page functionality
 */
function initBookingPage() {
    // Set up booking navigation
    setupBookingNavigation();
    
    // Set up form validation
    setupFormValidation();
    
    // Check if user is logged in
    checkAuthStatus();
}

/**
 * Set up the booking navigation tabs
 */
function setupBookingNavigation() {
    const navLinks = document.querySelectorAll('.booking-nav-link');
    const bookingSections = document.querySelectorAll('.booking-section');
    
    // Add click event listeners to each navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section ID from the href attribute
            const targetId = this.getAttribute('href').substring(1);
            
            // Remove active class from all links and sections
            navLinks.forEach(link => link.classList.remove('active'));
            bookingSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link and corresponding section
            this.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });
    
    // Check if there's a hash in the URL and activate that tab
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const targetLink = document.querySelector(`.booking-nav-link[href="#${hash}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }
}

/**
 * Set up form validation for booking forms
 */
function setupFormValidation() {
    const bookingForms = document.querySelectorAll('.booking-form');
    
    bookingForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            const requiredFields = form.querySelectorAll('input[required], select[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Date validation for forms with date inputs
            const dateInputs = form.querySelectorAll('input[type="date"]');
            if (dateInputs.length >= 2) {
                // Check if there are pairs of dates (start/end, departure/return, etc.)
                for (let i = 0; i < dateInputs.length - 1; i += 2) {
                    const startDate = new Date(dateInputs[i].value);
                    const endDate = new Date(dateInputs[i+1].value);
                    
                    if (startDate > endDate) {
                        isValid = false;
                        dateInputs[i].classList.add('error');
                        dateInputs[i+1].classList.add('error');
                        showMessage('error', 'End date cannot be before start date');
                    }
                }
            }
            
            if (isValid) {
                // In a real application, this would submit the form or make an API call
                showMessage('success', 'Booking search initiated! This is a demo, so no actual search will be performed.');
                
                // Reset form after successful submission
                setTimeout(() => {
                    form.reset();
                }, 2000);
            } else {
                showMessage('error', 'Please fill in all required fields correctly');
            }
        });
    });
}

/**
 * Check if user is logged in and update UI accordingly
 */
function checkAuthStatus() {
    // Check if there's a token in localStorage
    const token = localStorage.getItem('authToken');
    const authButtons = document.getElementById('auth-buttons');
    
    if (token) {
        // User is logged in, update the header buttons
        authButtons.innerHTML = `
            <a href="profile.html" class="btn btn-secondary">My Profile</a>
            <button id="logout-btn" class="btn btn-primary">Log Out</button>
        `;
        
        // Add event listener to logout button
        document.getElementById('logout-btn').addEventListener('click', function() {
            // Clear auth data from localStorage
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            
            // Redirect to home page
            window.location.href = 'index.html';
        });
    }
}

/**
 * Show a message to the user
 * @param {string} type - The type of message (success, error, info)
 * @param {string} text - The message text
 */
function showMessage(type, text) {
    // Create message element if it doesn't exist
    let messageContainer = document.querySelector('.message-container');
    
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';
        document.body.appendChild(messageContainer);
    }
    
    // Create the message element
    const message = document.createElement('div');
    message.className = `message message-${type}`;
    message.textContent = text;
    
    // Add the message to the container
    messageContainer.appendChild(message);
    
    // Remove the message after a delay
    setTimeout(() => {
        message.classList.add('hide');
        setTimeout(() => {
            message.remove();
        }, 500);
    }, 5000);
}