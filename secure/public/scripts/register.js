document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Fetch the CSRF token from your /csrf-token endpoint
    const csrfToken = await fetch('/csrf-token')
        .then(res => res.json())
        .then(data => data.csrfToken);

    try {
        console.log("UR HERE");
        // Send registration request with CSRF token and form data in the body
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken,  // Include CSRF token in the request headers
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful');
            window.location.href = '/pages/login';  // Redirect to login after successful registration
        } else {
            alert(data.message);  // Handle error messages
        }
    } catch (error) {
        console.error('Error registering:', error);
        alert('Error registering');
    }
});
