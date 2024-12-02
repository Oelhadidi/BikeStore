document.getElementById('add-product-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire
    // Récupérer les données du formulaire
    const name = document.getElementById('product-name').value.trim();
    const description = document.getElementById('product-description').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const imageUrl = document.getElementById('product-image').value.trim();

    const csrfToken = await fetch('/csrf-token')
        .then(res => res.json())
        .then(data => data.csrfToken);

    if (!csrfToken) {
        alert("CSRF token is missing! Please refresh the page.");
        return;
    }

    try {
        console.log("CSRF Token:", csrfToken);
        // Effectuer une requête POST au serveur
        const response = await fetch('/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken, // Inclure le jeton CSRF
            },
            body: JSON.stringify({ name, description, price, imageUrl }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Bike added successfully!');
            window.location.href = '/pages/products'; // Redirige vers la page des produits
        } else {
            alert(result.message || 'Error adding bike');
        }
    } catch (error) {
        console.error('Error adding bike:', error);
        alert('Failed to add the bike. Please try again.');
    }
});
