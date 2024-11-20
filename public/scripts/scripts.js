window.onload = async () => {
    
    try {
        const response = await fetch('/products'); // Assuming this is the endpoint
        const products = await response.json();
        const productsList = document.getElementById('products-list');
        productsList.innerHTML = ''; // Clear the products list

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            productCard.innerHTML = `
                <img src="${product.imageUrl || 'default-image.jpg'}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price">$${product.price}</div>
            `;

            productsList.appendChild(productCard);
        });

        // Show the "See More Products" button
        const seeMoreBtn = document.getElementById('see-more-btn');
        seeMoreBtn.style.display = 'block';

        // Add a click event to the button to navigate to the products page
        seeMoreBtn.onclick = () => {
            window.location.href = '/products'; // This navigates to your products page
        };
    } catch (error) {
        console.error('Error fetching products:', error);
    }

    
};

window.addEventListener('DOMContentLoaded', () => {
    const shopNowBtn = document.getElementById('shop-now-btn');

    shopNowBtn?.addEventListener('click', () => {
    
        window.location.href = '/pages/products';
    });
});