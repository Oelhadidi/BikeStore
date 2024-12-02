// Handle Login Form Submission



document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Obtenez le token reCAPTCHA
        const recaptchaToken = await grecaptcha.execute('6LcC_I8qAAAAALhk9qZg7GiYdwkmzMy6RRt_8Z3L', { action: 'login' });
        console.log('recaptchaToken front: ', recaptchaToken);
        // Envoyer les données au backend avec le token reCAPTCHA
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, recaptchaToken }) // Ajout du token reCAPTCHA
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            alert(data.message);
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('authUser', JSON.stringify(data.user));
            window.location.href = '/';
        } else if (response.status === 429) {
            alert('Too many attempts. Please try again later.');
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('Error logging in. Please check your network connection.');
    }
});


// Handle Register Form Submission
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
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
