window.onload = async () => {
    try {
        // Load all products initially
        await loadProducts();

        // Attach search functionality to the search button
        const searchBtn = document.getElementById('search-btn');
        searchBtn.onclick = async () => {
            const searchInput = document.getElementById('search-input').value.trim();
            await loadProducts(searchInput);
        };

        // Admin-specific setup
        const user = JSON.parse(localStorage.getItem('authUser'));
        const isAdmin = user && user.role === 'admin';

        if (isAdmin) {
            const adminActions = document.getElementById('admin-actions');
            adminActions.style.display = 'block'; // Show admin actions
            const addBikeBtn = document.getElementById('add-bike-btn');
            addBikeBtn.onclick = () => {
                window.location.href = '/pages/add-product'; // Redirect to Add Product page
            };
        }
    } catch (error) {
        console.error('Error initializing page:', error);
    }
};

// Function to fetch and display products
async function loadProducts(keyword = "") {
    try {
        const endpoint = keyword ? `/products/search?keyword=${encodeURIComponent(keyword)}` : `/products`;
        const response = await fetch(endpoint);
        const products = await response.json();

        const productsList = document.getElementById('products-list');
        productsList.innerHTML = ''; // Clear the products list

        const user = JSON.parse(localStorage.getItem('authUser'));
        const isAdmin = user && user.role === 'admin';

        // Display each product
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            productCard.innerHTML = `
                <img src="${product.imageUrl || 'default-image.jpg'}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price">$${product.price}</div>
            `;

            // Add admin-specific actions
            if (isAdmin) {
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('edit-btn');
                editButton.onclick = () => {
                    window.location.href = `/pages/edit-product/${product.id}`;
                };

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-btn');
                deleteButton.onclick = () => {
                    deleteProduct(product.id);
                };

                productCard.appendChild(editButton);
                productCard.appendChild(deleteButton);
            }

            productsList.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Function to delete a product
async function deleteProduct(productId) {
    try {
        const csrfToken = await fetch('/csrf-token')
            .then(res => res.json())
            .then(data => data.csrfToken);

        const response = await fetch(`/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken,
            },
        });

        if (response.ok) {
            alert('Product deleted successfully');
            await loadProducts(); // Reload products after deletion
        } else {
            const result = await response.json();
            alert(result.message || 'Error deleting product');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}
