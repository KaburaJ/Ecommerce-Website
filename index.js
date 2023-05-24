let selectedProductId = null;

// Function to fetch and display all products
function fetchProducts() {
  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((data) => {
      displayProducts(data);
    });
}

// Function to fetch and display products from a specific category
function fetchProductsByCategory(category) {
  fetch(`https://fakestoreapi.com/products/category/${category}`)
    .then((response) => response.json())
    .then((data) => {
      displayProducts(data);
    });
}

// Function to display products
function displayProducts(products) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  products.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.innerHTML = `
        <img src="${product.image}"/>
          <h3>${product.title}</h3>
          <p>Category: ${product.category}</p>
          <p>Price: $${product.price}</p>
          <button onclick="openProductModal(${product.id})">View Details</button>
          <hr>
        `;
    productList.appendChild(productItem);
  });
}

// Function to fetch and display a single product
function fetchProductDetails(productId) {
  fetch(`https://fakestoreapi.com/products/${productId}`)
    .then((response) => response.json())
    .then((product) => {
      const productDetails = document.getElementById("product-details");
      productDetails.innerHTML = `
          <img src="${product.image}"/>
            <h3>${product.title}</h3>
            <p>Category: ${product.category}</p>
            <p>Price: $${product.price}</p>
          `;
    });
}

// Function to open the product modal
function openProductModal(productId) {
  selectedProductId = productId;
  fetchProductDetails(productId);

  const modal = document.getElementById("product-modal");
  modal.style.display = "block";
}

// Function to close the product modal
function closeProductModal() {
  selectedProductId = null;

  const modal = document.getElementById("product-modal");
  modal.style.display = "none";

  fetchProducts(); // Display all products
}

// Function to add a product to the cart
function addToCart(productId) {
  fetch(`https://fakestoreapi.com/products/${productId}`)
    .then((response) => response.json())
    .then((product) => {
      const cartItems = document.getElementById("cart-items");
      const cartItem = document.createElement("li");
      cartItem.innerText = `${product.title} - $${product.price}`;

      // Store the cart item in local storage
      const cart = getCartFromLocalStorage();
      cart.push(product);
      saveCartToLocalStorage(cart);

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Delete";
      deleteButton.addEventListener("click", () => {
        cartItem.remove();
        removeFromCartInLocalStorage(product);
        updateCartCounter();
      });

      cartItem.appendChild(deleteButton);
      cartItems.appendChild(cartItem);
      updateCartCounter();
    });
}

function getCartFromLocalStorage() {
  const cartJson = localStorage.getItem("cart");
  return cartJson ? JSON.parse(cartJson) : [];
}

function saveCartToLocalStorage(cart) {
  const cartJson = JSON.stringify(cart);
  localStorage.setItem("cart", cartJson);
}

function removeFromCartInLocalStorage(product) {
  const cart = getCartFromLocalStorage();
  const updatedCart = cart.filter((item) => item.id !== product.id);
  saveCartToLocalStorage(updatedCart);
}


function updateCartCounter() {
  const cartCounter = document.getElementById("cart-counter");
  const cartItems = getCartFromLocalStorage();
  cartCounter.innerText = cartItems.length;
}


// Function to fetch and display the cart items
function displayCartItems() {
  const cartItems = getCartFromLocalStorage();
  const cartList = document.getElementById("cart-items");
  cartList.innerHTML = "";

  cartItems.forEach((product) => {
    const cartItem = document.createElement("li");
    cartItem.innerText = `${product.title} - $${product.price}`;

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", () => {
      cartItem.remove();
      removeFromCartInLocalStorage(product);
      updateCartCounter();
    });

    cartItem.appendChild(deleteButton);
    cartList.appendChild(cartItem);
  });
}

// Call displayCartItems function to show the cart items on page load
displayCartItems();

// Function to filter products by category
function filterProductsByCategory() {
  const categoryFilter = document.getElementById("category-filter");
  const selectedCategory = categoryFilter.value;

  if (selectedCategory === "") {
    fetchProducts();
  } else {
    fetchProductsByCategory(selectedCategory);
  }
}

// Initial function call
fetchProducts(); // Display all products
updateCartCounter(); // Update cart counte
