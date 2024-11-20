window.addEventListener('DOMContentLoaded', () => {
    const authToken = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('authUser'));


    const logoutBtn = document.getElementById('logout-btn');

    const navLinks = document.getElementById('nav-links');
    const userMenu = document.getElementById('user-menu');

    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    
    if (authToken && user) {
        // Hide only Login and Register links
        loginLink.style.display = 'none';
        registerLink.style.display = 'none';

        // Show Profile Icon and Logout button
        userMenu.style.display = 'block';
    } else {
        // Show Login and Register links
        loginLink.style.display = 'block';
        registerLink.style.display = 'block';

        // Hide Profile Icon and Logout button
        userMenu.style.display = 'none';
    }



    logoutBtn?.addEventListener('click', () => {
        // Remove authToken and authUser from localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');

        // Reset the header to show Login and Register links
        navLinks.style.display = 'flex';
        userMenu.style.display = 'none';

        alert('You have logged out successfully');
        window.location.href = '/';  // Redirect to the homepage or any other page after logout
    });
});
