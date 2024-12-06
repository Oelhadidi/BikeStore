// Handle Register Form Submission
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();

        if (response.ok) {
            alert('Registration successful');
            window.location.href = '/pages/login';  // Redirect to login after successful registration
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error registering:', error);
        alert('Error registering');
    }
});
