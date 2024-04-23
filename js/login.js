// Dummy user credentials
sessionStorage.setItem('isLoggedIn', 'false');
const users = [
    { username: 'Pranavi', password: 'Pranavi' },
    { username: 'Teju', password: 'Teju' }
];


// Function to handle form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting

    // Get input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Dummy authentication
    const authenticatedUser = users.find(user => user.username === username && user.password === password);
    if (authenticatedUser) {
            sessionStorage.setItem('isLoggedIn','true');
            window.location.href = 'home.html';
    } 
    else {
        alert('Invalid username or password. Please try again.');
    }
});