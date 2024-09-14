document.getElementById('signup-form').addEventListener('submit', function(event) {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        event.preventDefault();
    }
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    // Example validation (ensure fields are filled)
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Please fill in all fields.');
        event.preventDefault();
    }
});
