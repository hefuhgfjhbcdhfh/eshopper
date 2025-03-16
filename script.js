// Sample product data
const products = [
    {
        id: 1,
        name: "Classic T-Shirt",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80"
    },
    {
        id: 2,
        name: "Denim Jeans",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1026&q=80"
    },
    {
        id: 3,
        name: "Sneakers",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
        id: 4,
        name: "Watch",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1099&q=80"
    }
];


// Additional categories for navigation
const categories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Clothing" },
    { id: 3, name: "Accessories" },
    { id: 4, name: "Home & Kitchen" }
];

// DOM Elements
const productListEl = document.getElementById('product-list');
const cartIconEl = document.getElementById('cart-icon');
const cartModalEl = document.getElementById('cart-modal');
const closeCartEl = document.getElementById('close-cart');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.querySelector('.cart-count');
const navLinks = document.querySelectorAll('nav ul li a');
const shopNowBtn = document.querySelector('.hero .btn');
const checkoutBtn = document.querySelector('.checkout-btn');

// Cart array
let cart = [];

// Display products
function displayProducts() {
    productListEl.innerHTML = '';
    
    products.forEach(product => {
        const productEl = document.createElement('div');
        productEl.classList.add('product');
        
        productEl.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-description">${product.description}</p>
                <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productListEl.appendChild(productEl);
    });
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add to cart function
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCart();
    
    // Show notification
    showNotification(`${product.name} added to cart!`);
    
    // Open cart modal
    cartModalEl.classList.add('active');
}

// Update cart display
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountEl.textContent = totalItems;
    
    // Update cart items
    cartItemsEl.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p>Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const cartItemEl = document.createElement('div');
            cartItemEl.classList.add('cart-item');
            
            cartItemEl.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <span class="quantity-num">${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    </div>
                </div>
                <span class="remove-item" data-id="${item.id}">×</span>
            `;
            
            cartItemsEl.appendChild(cartItemEl);
        });
    }
    
    // Add event listeners to quantity buttons and remove buttons
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeItem);
    });
    
    // Update cart total
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotalEl.textContent = total.toFixed(2);
}

// Increase quantity
function increaseQuantity(e) {
    const itemId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(i => i.id === itemId);
    
    if (item) {
        item.quantity++;
        updateCart();
    }
}

// Decrease quantity
function decreaseQuantity(e) {
    const itemId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(i => i.id === itemId);
    
    if (item && item.quantity > 1) {
        item.quantity--;
        updateCart();
    } else if (item && item.quantity === 1) {
        removeItem(e);
    }
}

// Remove item
function removeItem(e) {
    const itemId = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Add styles dynamically
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.background = '#ff6b6b';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';
    
    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Toggle cart modal
cartIconEl.addEventListener('click', (e) => {
    e.preventDefault();
    cartModalEl.classList.add('active');
});

closeCartEl.addEventListener('click', () => {
    cartModalEl.classList.remove('active');
});

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    if (cartModalEl.classList.contains('active') && 
        !cartModalEl.contains(e.target) && 
        e.target !== cartIconEl) {
        cartModalEl.classList.remove('active');
    }
});

// Filter products by category (placeholder function)
function filterProducts(categoryId) {
    showNotification(`Filtering by category: ${categories.find(c => c.id === categoryId).name}`);
    // In a real app, this would filter products by category
    // For demo purposes, we'll just show a notification
}

// Function to display categories page
function showCategoriesPage() {
    productListEl.innerHTML = '';
    
    const categoriesTitle = document.createElement('h2');
    categoriesTitle.classList.add('section-title');
    categoriesTitle.textContent = 'Product Categories';
    productListEl.appendChild(categoriesTitle);
    
    const categoriesContainer = document.createElement('div');
    categoriesContainer.classList.add('categories-container');
    categoriesContainer.style.display = 'grid';
    categoriesContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
    categoriesContainer.style.gap = '20px';
    
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.classList.add('category-card');
        categoryCard.style.background = 'white';
        categoryCard.style.padding = '30px';
        categoryCard.style.borderRadius = '5px';
        categoryCard.style.textAlign = 'center';
        categoryCard.style.cursor = 'pointer';
        categoryCard.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
        categoryCard.style.transition = 'transform 0.3s, box-shadow 0.3s';
        
        categoryCard.innerHTML = `
            <h3>${category.name}</h3>
            <p>View all products in this category</p>
            <button class="btn category-btn" data-id="${category.id}">Browse</button>
        `;
        
        categoryCard.addEventListener('mouseenter', () => {
            categoryCard.style.transform = 'translateY(-5px)';
            categoryCard.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
        
        categoryCard.addEventListener('mouseleave', () => {
            categoryCard.style.transform = 'translateY(0)';
            categoryCard.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
        });
        
        categoriesContainer.appendChild(categoryCard);
    });
    
    productListEl.appendChild(categoriesContainer);
    
    // Add event listeners to category buttons
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const categoryId = parseInt(e.target.getAttribute('data-id'));
            filterProducts(categoryId);
            // After filtering, show products page again
            setTimeout(() => {
                displayProducts();
                updateActiveNavLink('Products');
            }, 1000);
        });
    });
}

// Function to display about page
function showAboutPage() {
    productListEl.innerHTML = '';
    
    const aboutContent = document.createElement('div');
    aboutContent.classList.add('about-content');
    aboutContent.style.background = 'white';
    aboutContent.style.padding = '30px';
    aboutContent.style.borderRadius = '5px';
    aboutContent.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    
    aboutContent.innerHTML = `
        <h2 class="section-title">About eShopper</h2>
        <p>eShopper is your one-stop destination for all your online shopping needs. We offer a wide range of products at competitive prices.</p>
        <h3>Our Mission</h3>
        <p>To provide customers with a seamless and enjoyable shopping experience with high-quality products and excellent customer service.</p>
        <h3>Our Story</h3>
        <p>Founded in 2025, eShopper has quickly grown to become one of the leading online retailers. We started with a small selection of products and have expanded to offer thousands of items across multiple categories.</p>
        <h3>Why Choose Us?</h3>
        <ul>
            <li>High-quality products</li>
            <li>Competitive prices</li>
            <li>Fast shipping</li>
            <li>Excellent customer service</li>
            <li>Secure payment options</li>
        </ul>
        <button class="btn contact-us-btn">Contact Us</button>
    `;
    
    productListEl.appendChild(aboutContent);
    
    // Add event listener to contact us button
    document.querySelector('.contact-us-btn').addEventListener('click', () => {
        showContactPage();
        updateActiveNavLink('Contact');
    });
}

// Function to display contact page
function showContactPage() {
    productListEl.innerHTML = '';
    
    const contactContent = document.createElement('div');
    contactContent.classList.add('contact-content');
    contactContent.style.background = 'white';
    contactContent.style.padding = '30px';
    contactContent.style.borderRadius = '5px';
    contactContent.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    
    contactContent.innerHTML = `
        <h2 class="section-title">Contact Us</h2>
        <p>We'd love to hear from you! Fill out the form below to get in touch with our team.</p>
        <form id="contact-form">
            <div class="form-group">
                <label for="name">Your Name</label>
                <input type="text" id="name" required>
            </div>
            <div class="form-group">
                <label for="email">Your Email</label>
                <input type="email" id="email" required>
            </div>
            <div class="form-group">
                <label for="subject">Subject</label>
                <input type="text" id="subject" required>
            </div>
            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" rows="5" required></textarea>
            </div>
            <button type="submit" class="btn submit-form-btn">Send Message</button>
        </form>
        <div class="contact-info">
            <h3>Contact Information</h3>
            <p>Email: info@eshopper.com</p>
            <p>Phone: 0745524890</p>
            <p>Address: Kabarak University, Nakuru City, EC 12345</p>
        </div>
    `;
    
    productListEl.appendChild(contactContent);
    
    // Style the form
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.style.marginBottom = '20px';
    });
    
    const labels = document.querySelectorAll('label');
    labels.forEach(label => {
        label.style.display = 'block';
        label.style.marginBottom = '5px';
    });
    
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.style.width = '100%';
        input.style.padding = '10px';
        input.style.borderRadius = '4px';
        input.style.border = '1px solid #ddd';
    });
    
    const contactInfo = document.querySelector('.contact-info');
    contactInfo.style.marginTop = '30px';
    
    // Add event listener to form submission
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Your message has been sent successfully!');
        contactForm.reset();
    });
}

// Function to handle checkout process
function processCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // In a real app, this would redirect to a checkout page
    // For demo purposes, we'll just show a notification and clear the cart
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    showNotification(`Checkout successful! Total: $${total.toFixed(2)}`);
    cart = [];
    updateCart();
    cartModalEl.classList.remove('active');
    
    // Show a thank you message in the product list
    productListEl.innerHTML = '';
    
    const thankYouMessage = document.createElement('div');
    thankYouMessage.classList.add('thank-you-message');
    thankYouMessage.style.textAlign = 'center';
    thankYouMessage.style.padding = '50px 20px';
    
    thankYouMessage.innerHTML = `
        <h2>Thank You For Your Purchase!</h2>
        <p>Your order has been placed successfully.</p>
        <p>Order total: $${total.toFixed(2)}</p>
        <p>A confirmation email has been sent to your email address.</p>
        <button class="btn continue-shopping-btn">Continue Shopping</button>
    `;
    
    productListEl.appendChild(thankYouMessage);
    
    // Add event listener to continue shopping button
    document.querySelector('.continue-shopping-btn').addEventListener('click', () => {
        displayProducts();
        updateActiveNavLink('Home');
    });
}

// Update active navigation link
function updateActiveNavLink(linkText) {
    navLinks.forEach(link => {
        if (link.textContent === linkText) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize the application
function init() {
    displayProducts();
    updateCart();
    
    // Add event listeners to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show the appropriate content based on the clicked link
            const linkText = link.textContent;
            
            switch (linkText) {
                case 'Home':
                    displayProducts();
                    break;
                case 'Products':
                    displayProducts();
                    break;
                case 'Categories':
                    showCategoriesPage();
                    break;
                case 'About':
                    showAboutPage();
                    break;
                case 'Contact':
                    showContactPage();
                    break;
            }
        });
    });
    
    // Add event listener to "Shop Now" button
    shopNowBtn.addEventListener('click', () => {
        // Scroll to products section
        const productsSection = document.querySelector('.featured-products');
        productsSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Add event listener to checkout button
    checkoutBtn.addEventListener('click', processCheckout);
    
    // Add event listeners to footer links
    const footerLinks = document.querySelectorAll('.footer-section ul li a');
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the link text
            const linkText = link.textContent;
            
            // Show the appropriate content and update the nav
            switch (linkText) {
                case 'Home':
                    displayProducts();
                    updateActiveNavLink('Home');
                    break;
                case 'Products':
                    displayProducts();
                    updateActiveNavLink('Products');
                    break;
                case 'Categories':
                    showCategoriesPage();
                    updateActiveNavLink('Categories');
                    break;
                case 'About':
                    showAboutPage();
                    updateActiveNavLink('About');
                    break;
                case 'Contact':
                    showContactPage();
                    updateActiveNavLink('Contact');
                    break;
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
