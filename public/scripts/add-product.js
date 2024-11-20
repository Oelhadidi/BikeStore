document.getElementById('add-product-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission from reloading the page

    // Collect form data
    const name = document.getElementById('product-name').value.trim();
    const description = document.getElementById('product-description').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const imageUrl = document.getElementById('product-image').value.trim();

    try {
        // Make a POST request to the server
        const response = await fetch('/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description, price, imageUrl }),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Bike added successfully!');
            window.location.href = '/pages/products'; // Redirect to the shop page
        } else {
            alert(result.message || 'Error adding bike');
        }
    } catch (error) {
        console.error('Error adding bike:', error);
        alert('Failed to add the bike. Please try again.');
    }
});
