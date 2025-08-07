document.addEventListener('DOMContentLoaded', function() {
    // Search tabs functionality
    const searchTabs = document.querySelectorAll('.search-tab');
    
    searchTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            searchTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Here you would typically show/hide the corresponding form sections
            // For this demo, we'll just keep the same form visible
        });
    });
    
    // Interest tag selection
    const interestTags = document.querySelectorAll('.interest-tag');
    
    interestTags.forEach(tag => {
        tag.addEventListener('click', function() {
            this.classList.toggle('selected');
            
            // Style for selected tags
            if (this.classList.contains('selected')) {
                this.style.backgroundColor = '#4F46E5';
                this.style.color = 'white';
            } else {
                this.style.backgroundColor = '#f0f0f0';
                this.style.color = '#333';
            }
        });
    });
    
    // Create itinerary button
    const createItineraryBtn = document.querySelector('.search-btn');
    
    // Only add event listener if the button exists (only on home page)
    if (createItineraryBtn) {
        createItineraryBtn.addEventListener('click', function() {
        // Get form values
        const destination = document.querySelector('.search-group input[placeholder="Where are you going?"]').value;
        const dates = document.querySelector('.search-group input[placeholder="Select dates"]').value;
        const travelers = document.querySelector('.search-group input[placeholder="1 Adult"]')?.value;
        const budget = document.querySelector('.search-group select').value;
        
        // Get selected interests
        const selectedInterests = [];
        document.querySelectorAll('.interest-tag.selected').forEach(tag => {
            selectedInterests.push(tag.textContent);
        });
        
        // Validate form
        if (!destination) {
            alert('Please enter a destination');
            return;
        }
        
        // Redirect to itinerary.html (like booking)
        window.location.href = 'itinerary.html';
    });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mobile navigation toggle (for responsive design)
    // This would be implemented if we had a hamburger menu for mobile
    
    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (!email || !isValidEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // In a real application, you would send this to a backend
            alert(`Thank you for subscribing with ${email}!`);
            emailInput.value = '';
        });
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Destination card hover effects
    const destinationCards = document.querySelectorAll('.destination-card');
    
    if (destinationCards.length > 0) {
        destinationCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });
    }
    
    // Feature card hover effects
    const featureCards = document.querySelectorAll('.feature-card');
    
    if (featureCards.length > 0) {
        featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    }
});