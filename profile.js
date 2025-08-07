// profile.js - Handles user profile functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        // Redirect to sign in page if not authenticated
        window.location.href = 'signin.html';
        return;
    }

    // Initialize profile page
    initProfilePage();

    // Set up navigation
    setupNavigation();

    // Set up form submissions
    setupFormSubmissions();
});

// Initialize profile page with user data
function initProfilePage() {
    const profileLoading = document.getElementById('profile-loading');
    const profileError = document.getElementById('profile-error');
    const profileContent = document.querySelector('.profile-content');

    // Show loading state
    profileLoading.style.display = 'block';
    profileError.style.display = 'none';

    // In a real application, we would fetch user data from the server
    // For this demo, we'll use mock data
    setTimeout(() => {
        try {
            // Simulate API call
            const userData = getMockUserData();
            
            // Populate user data in the profile
            populateUserProfile(userData);
            
            // Hide loading, show content
            profileLoading.style.display = 'none';
            document.getElementById('profile-data').style.display = 'block';
            document.getElementById('personal-info').classList.add('active');
        } catch (error) {
            // Show error message
            profileLoading.style.display = 'none';
            profileError.style.display = 'block';
            profileError.textContent = 'Error loading profile data. Please try again later.';
            console.error('Error loading profile:', error);
        }
    }, 1000); // Simulate network delay
}

// Set up navigation between profile sections
function setupNavigation() {
    const navLinks = document.querySelectorAll('.profile-nav a');
    const sections = document.querySelectorAll('.profile-section-content');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section id from the href attribute
            const targetId = this.getAttribute('href').substring(1);
            
            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show the target section
            document.getElementById(targetId).classList.add('active');
            
            // Update active navigation
            navLinks.forEach(navLink => {
                navLink.parentElement.classList.remove('active');
            });
            this.parentElement.classList.add('active');
        });
    });
}

// Set up form submissions
function setupFormSubmissions() {
    // Personal info form
    const personalInfoForm = document.getElementById('personal-info-form');
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const userData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                bio: formData.get('bio')
            };
            
            // In a real app, we would send this data to the server
            console.log('Updating personal info:', userData);
            showMessage('Personal information updated successfully!', 'success');
        });
    }

    // Add wishlist item form
    const wishlistForm = document.getElementById('wishlist-form');
    if (wishlistForm) {
        wishlistForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const wishlistItem = {
                destination: formData.get('wishlist-destination'),
                notes: formData.get('wishlist-notes')
            };
            
            // Add the new wishlist item to the UI
            addWishlistItem(wishlistItem);
            
            // Reset the form
            this.reset();
            
            showMessage('Wishlist item added successfully!', 'success');
        });
    }

    // Add travel history item form
    const historyForm = document.getElementById('history-form');
    if (historyForm) {
        historyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const historyItem = {
                destination: formData.get('history-destination'),
                dates: formData.get('history-dates'),
                notes: formData.get('history-notes')
            };
            
            // Add the new history item to the UI
            addHistoryItem(historyItem);
            
            // Reset the form
            this.reset();
            
            showMessage('Travel history item added successfully!', 'success');
        });
    }

    // Add address form
    const addressForm = document.getElementById('address-form');
    if (addressForm) {
        addressForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const addressItem = {
                label: formData.get('address-label'),
                street: formData.get('address-street'),
                city: formData.get('address-city'),
                state: formData.get('address-state'),
                zip: formData.get('address-zip'),
                country: formData.get('address-country')
            };
            
            // Add the new address to the UI
            addAddressItem(addressItem);
            
            // Reset the form
            this.reset();
            
            showMessage('Address added successfully!', 'success');
        });
    }

    // Delete account button
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                // In a real app, we would send a request to delete the account
                console.log('Deleting account...');
                
                // Clear local storage and redirect to home page
                localStorage.removeItem('authToken');
                window.location.href = 'index.html';
            }
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Clear auth token and redirect to sign in page
            localStorage.removeItem('authToken');
            window.location.href = 'signin.html';
        });
    }
}

// Populate user profile with data
function populateUserProfile(userData) {
    // Set user name in the sidebar
    // Note: There's no user-name element in the HTML, so we'll skip this step
    // If you want to add a user name display, you can add an element with ID 'user-name' to the HTML

    // Set avatar placeholder with initials
    const avatarPlaceholder = document.querySelector('.avatar-placeholder');
    if (avatarPlaceholder) {
        avatarPlaceholder.textContent = getInitials(userData.firstName, userData.lastName);
    }

    // Populate personal info form
    document.getElementById('first-name').value = userData.firstName || '';
    document.getElementById('last-name').value = userData.lastName || '';
    document.getElementById('email').value = userData.email || '';
    document.getElementById('phone').value = userData.phone || '';
    document.getElementById('bio').value = userData.bio || '';

    // Populate wishlist items
    const wishlistItems = document.getElementById('wishlist-items');
    const wishlistEmpty = document.getElementById('wishlist-empty');
    
    if (userData.wishlist && userData.wishlist.length > 0) {
        wishlistEmpty.style.display = 'none';
        userData.wishlist.forEach(item => {
            addWishlistItem(item);
        });
    } else {
        wishlistEmpty.style.display = 'block';
    }

    // Populate travel history items
    const historyItems = document.getElementById('travel-history-items');
    const historyEmpty = document.getElementById('travel-history-empty');
    
    if (userData.travelHistory && userData.travelHistory.length > 0) {
        historyEmpty.style.display = 'none';
        userData.travelHistory.forEach(item => {
            addHistoryItem(item);
        });
    } else {
        historyEmpty.style.display = 'block';
    }

    // Populate address items
    const addressItems = document.getElementById('addresses-items');
    const addressesEmpty = document.getElementById('addresses-empty');
    
    if (userData.addresses && userData.addresses.length > 0) {
        addressesEmpty.style.display = 'none';
        userData.addresses.forEach(item => {
            addAddressItem(item);
        });
    } else {
        addressesEmpty.style.display = 'block';
    }
}

// Add a wishlist item to the UI
function addWishlistItem(item) {
    const wishlistItems = document.getElementById('wishlist-items');
    const wishlistEmpty = document.getElementById('wishlist-empty');
    
    // Hide the empty message
    wishlistEmpty.style.display = 'none';
    
    // Create the wishlist item element
    const itemElement = document.createElement('div');
    itemElement.className = 'wishlist-item';
    itemElement.innerHTML = `
        <h3>${item.destination}</h3>
        <p>${item.notes || 'No notes added'}</p>
        <div class="item-actions">
            <button class="btn-icon btn-edit" title="Edit">✏️</button>
            <button class="btn-icon btn-delete" title="Delete">🗑️</button>
        </div>
    `;
    
    // Add event listeners for edit and delete buttons
    const deleteBtn = itemElement.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this wishlist item?')) {
            itemElement.remove();
            
            // Show empty message if no items left
            if (wishlistItems.children.length === 0) {
                wishlistEmpty.style.display = 'block';
            }
        }
    });
    
    // Add the item to the list
    wishlistItems.appendChild(itemElement);
}

// Add a travel history item to the UI
function addHistoryItem(item) {
    const historyItems = document.getElementById('travel-history-items');
    const historyEmpty = document.getElementById('travel-history-empty');
    
    // Hide the empty message
    historyEmpty.style.display = 'none';
    
    // Create the history item element
    const itemElement = document.createElement('div');
    itemElement.className = 'history-item';
    itemElement.innerHTML = `
        <h3>${item.destination}</h3>
        <p><strong>Dates:</strong> ${item.dates || 'Not specified'}</p>
        <p>${item.notes || 'No notes added'}</p>
        <div class="item-actions">
            <button class="btn-icon btn-edit" title="Edit">✏️</button>
            <button class="btn-icon btn-delete" title="Delete">🗑️</button>
        </div>
    `;
    
    // Add event listeners for edit and delete buttons
    const deleteBtn = itemElement.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this travel history item?')) {
            itemElement.remove();
            
            // Show empty message if no items left
            if (historyItems.children.length === 0) {
                historyEmpty.style.display = 'block';
            }
        }
    });
    
    // Add the item to the list
    historyItems.appendChild(itemElement);
}

// Add an address item to the UI
function addAddressItem(item) {
    const addressItems = document.getElementById('addresses-items');
    const addressesEmpty = document.getElementById('addresses-empty');
    
    // Hide the empty message
    addressesEmpty.style.display = 'none';
    
    // Create the address item element
    const itemElement = document.createElement('div');
    itemElement.className = 'address-item';
    itemElement.innerHTML = `
        <h3>${item.label || 'Address'}</h3>
        <p>${item.street}</p>
        <p>${item.city}, ${item.state} ${item.zip}</p>
        <p>${item.country}</p>
        <div class="item-actions">
            <button class="btn-icon btn-edit" title="Edit">✏️</button>
            <button class="btn-icon btn-delete" title="Delete">🗑️</button>
        </div>
    `;
    
    // Add event listeners for edit and delete buttons
    const deleteBtn = itemElement.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this address?')) {
            itemElement.remove();
            
            // Show empty message if no items left
            if (addressItems.children.length === 0) {
                addressesEmpty.style.display = 'block';
            }
        }
    });
    
    // Add the item to the list
    addressItems.appendChild(itemElement);
}

// Get user initials for avatar placeholder
function getInitials(firstName, lastName) {
    return (firstName ? firstName.charAt(0) : '') + (lastName ? lastName.charAt(0) : '');
}

// Show a message to the user
function showMessage(message, type = 'info') {
    // Create message element if it doesn't exist
    let messageElement = document.getElementById('profile-message');
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'profile-message';
        document.querySelector('.profile-content').appendChild(messageElement);
    }
    
    // Set message content and style
    messageElement.textContent = message;
    messageElement.className = `message message-${type}`;
    messageElement.style.display = 'block';
    
    // Add styles if not already in the document
    if (!document.getElementById('message-styles')) {
        const style = document.createElement('style');
        style.id = 'message-styles';
        style.textContent = `
            .message {
                padding: 12px 20px;
                border-radius: 8px;
                margin-bottom: 20px;
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                animation: fadeIn 0.3s ease-out;
            }
            .message-success {
                background-color: #ECFDF5;
                color: #065F46;
                border: 1px solid #A7F3D0;
            }
            .message-error {
                background-color: #FEF2F2;
                color: #991B1B;
                border: 1px solid #FECACA;
            }
            .message-info {
                background-color: #EFF6FF;
                color: #1E40AF;
                border: 1px solid #BFDBFE;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Hide message after 3 seconds
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 3000);
}

// Get mock user data for demo purposes
function getMockUserData() {
    return {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        bio: 'Travel enthusiast and adventure seeker. Always looking for the next destination to explore!',
        wishlist: [
            {
                destination: 'Bali, Indonesia',
                notes: 'Visit the rice terraces and temples'
            },
            {
                destination: 'Santorini, Greece',
                notes: 'Watch the sunset in Oia'
            }
        ],
        travelHistory: [
            {
                destination: 'Tokyo, Japan',
                dates: 'May 2023',
                notes: 'Amazing food and culture!'
            },
            {
                destination: 'Paris, France',
                dates: 'September 2022',
                notes: 'Visited the Eiffel Tower and Louvre'
            }
        ],
        addresses: [
            {
                label: 'Home',
                street: '123 Main St',
                city: 'San Francisco',
                state: 'CA',
                zip: '94105',
                country: 'United States'
            }
        ]
    };
}