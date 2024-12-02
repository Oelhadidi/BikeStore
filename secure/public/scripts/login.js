// Handle Login Form Submission
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
             },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        console.log(data);

        if (response.ok) {
            alert(data.message);
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('authUser', JSON.stringify(data.user));
            window.location.href = '/';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('Error logging in');
    }
});

