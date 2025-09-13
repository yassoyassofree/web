// Simple hardcoded credentials
const VALID_CREDENTIALS = {
    username: "admin",
    password: "password123"
};

// Function to handle login
function handleLogin(event) {
    event.preventDefault(); // Prevent form submission
    
    // Get form values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;

    // Simple validation
    if (!username || !password) {
        showError("Please fill in all fields");
        return false;
    }

    // Check credentials
    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
        // Login successful
        if (rememberMe) {
            // Store credentials in localStorage if remember me is checked
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
        }
        
        // Redirect to dashboard or main page
        window.location.href = 'dashboard.html';
    } else {
        // Login failed
        showError("Invalid username or password");
    }
    
    return false;
}

// Function to show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Add to form
    const form = document.getElementById('login-form');
    form.insertBefore(errorDiv, form.firstChild);
    
    // Remove error after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Check for saved credentials
window.onload = function() {
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');
    
    if (savedUsername && savedPassword) {
        // Auto-fill the form
        document.getElementById('username').value = savedUsername;
        document.getElementById('password').value = savedPassword;
        document.getElementById('remember').checked = true;
    }
}
