window.onload = async () => {
    try {
        // Fetch all products from the server
        const response = await fetch('/products'); // Assuming this is the endpoint
        const products = await response.json();

        const productsList = document.getElementById('products-list');
        productsList.innerHTML = ''; // Clear the products list

        // Get the logged-in user from localStorage
        const user = JSON.parse(localStorage.getItem('authUser')); 
        const isAdmin = user && user.role === 'admin'; // Check if the user is an admin

        // Show "Add Bike" button if the user is an admin
        const adminActions = document.getElementById('admin-actions');
        if (isAdmin) {
            adminActions.style.display = 'block'; // Show the admin actions container
            const addBikeBtn = document.getElementById('add-bike-btn');
            addBikeBtn.onclick = () => {
                window.location.href = '/pages/add-product'; // Redirect to Add Product page
            };
        }

        // Loop through the products and create product cards
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            productCard.innerHTML = `
                <img src="${product.imageUrl || 'default-image.jpg'}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price">$${product.price}</div>
            `;

            // Add edit and delete buttons if the user is an admin
            if (isAdmin) {
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('edit-btn');
                editButton.onclick = () => {
                    window.location.href = `/pages/edit-product/${product.id}`; // Redirect to Edit Product page
                };

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-btn');
                deleteButton.onclick = () => {
                    deleteProduct(product.id); // Call delete logic
                };

                // Append the buttons to the product card
                productCard.appendChild(editButton);
                productCard.appendChild(deleteButton);
            }

            productsList.appendChild(productCard);
        });

        // Show the "See More Products" button
        const seeMoreBtn = document.getElementById('see-more-btn');
        seeMoreBtn.style.display = 'block';

        // Navigate to the products page when the "See More" button is clicked
        seeMoreBtn.onclick = () => {
            window.location.href = '/products';
        };
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

// Function to delete a product
async function deleteProduct(productId) {
    try {
        const response = await fetch(`/products/${productId}`, {
            method: 'DELETE', // Assuming you are using DELETE method to remove a product
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        if (response.ok) {
            alert('Product deleted successfully');
            window.location.reload(); // Reload the page to reflect the changes
        } else {
            alert(result.message || 'Error deleting product');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}
