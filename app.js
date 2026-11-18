

const $ = (selector) => document.querySelector(selector);

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const save = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const initialProducts = [
  {
    id: "p1",
    name: "Fresh Pechay",
    category: "Vegetables",
    price: 25,
    stock: 20,
    farmer: "Sample Farmer",
    phone: "09123456789",
    location: "Alibagon, Cajidiocan, Romblon",
    description: "Fresh pechay from a local farm.",
    icon: "🥬"
  },
  {
    id: "p2",
    name: "Fresh Bananas",
    category: "Fruits",
    price: 80,
    stock: 12,
    farmer: "Sample Farmer",
    phone: "09123456789",
    location: "Alibagon, Cajidiocan, Romblon",
    description: "Locally grown bananas.",
    icon: "🍌"
  },
  {
    id: "p3",
    name: "Cassava",
    category: "Root Crops",
    price: 40,
    stock: 8,
    farmer: "Sample Farmer",
    phone: "09123456789",
    location: "Alibagon, Cajidiocan, Romblon",
    description: "Freshly harvested cassava.",
    icon: "🥔"
  }
];

if (localStorage.getItem("agriProducts") === null) {
  save("agriProducts", initialProducts);
}

const getProducts = () => read("agriProducts", []);
const getCart = () => read("agriCart", []);
const getOrders = () => read("agriOrders", []);

const peso = (amount) =>
  "₱" + Number(amount || 0).toFixed(2);

const escapeHTML = (value = "") =>
  String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);

function mapLink(location) {
  return "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(location || "Alibagon, Cajidiocan, Romblon");
}

function stockLabel(stock) {
  if (stock <= 0) {
    return '<p class="out-stock">Out of Stock</p>';
  }

  if (stock <= 3) {
    return `<p class="low-stock">Only ${stock} left!</p>`;
  }

  return `<p class="stock">Available stock: ${stock}</p>`;
}

function header() {
    return `
    <header class="shop-header">
      <div class="top-header">
        <h2>🌱 AGRI-LINK</h2>

        <div class="header-icons">
          <a href="cart.html" title="Cart">🛒</a>
          <a href="orders.html" title="Messages">💬</a>
          <a href="public/login.html" title="My Profile">👤</a>
        </div>
      </div>

      <div class="search-box">
        <input
          type="search"
          placeholder="🔍 Search vegetables, fruits, and farmers..."
        >
      </div>

      <nav class="shop-nav">
        <a href="index.html">Home</a>
        <a href="products.html">Products</a>
        <a href="cart.html">Cart</a>
        <a href="orders.html">My Orders</a>
      </nav>
    </header>
  `;
}

function footer() {
  return `
    <footer>
      <strong>AGRI-LINK</strong>
      <p>Supporting local farmers in Alibagon, Cajidiocan, Romblon.</p>
      <p class="small">School project prototype — not a live marketplace.</p>
    </footer>
  `;
}

function bottomNavigation() {
  return `
    <nav class="bottom-nav">
      <a href="index.html">
        <span>🏠</span>
        <small>Home</small>
      </a>

      <a href="products.html">
        <span>🛍️</span>
        <small>Products</small>
      </a>

      <a href="cart.html">
        <span>🛒</span>
        <small>Cart</small>
      </a>

      <a href="orders.html">
        <span>📦</span>
        <small>Orders</small>
      </a>

      <a href="public/login.html">
        <span>👤</span>
        <small>Me</small>
      </a>
    </nav>
  `;
}

function productCard(product) {
  return `
    <article class="card">
      <div class="product-icon">${escapeHTML(product.icon || "🌱")}</div>
      <h3>${escapeHTML(product.name)}</h3>
      <p><strong>${peso(product.price)}</strong> per unit</p>
      ${stockLabel(Number(product.stock))}
      <p>Farmer: ${escapeHTML(product.farmer)}</p>
      <p>${escapeHTML(product.category)}</p>
      <a class="button" href="product.html?id=${encodeURIComponent(product.id)}">
        View Details
      </a>
      <button data-add="${escapeHTML(product.id)}"
        ${product.stock <= 0 ? "disabled" : ""}>
        Add to Cart
      </button>
    </article>
  `;
}

function homePage() {
  const products = getProducts().slice(0, 3);

  return `
    <main>
      <section class="hero">
        <h2>Fresh from Our Farmers to Your Home!</h2>
        <p>
          Buy local vegetables, fruits, and root crops from farmers
          in Alibagon, Cajidiocan, Romblon.
        </p>
        <a class="button" href="products.html">Shop Products</a>
      </section>

      <h2>Featured Products</h2>
      <div class="grid">
        ${products.length
          ? products.map(productCard).join("")
          : "<p>No products available yet.</p>"}
      </div>

      <section class="panel">
        <h2>Why Choose AGRI-LINK?</h2>
        <p>✓ Support local farmers</p>
        <p>✓ Check product prices and available stock</p>
        <p>✓ View farm and delivery locations</p>
        <p>✓ Track order status and rider information</p>
      </section>
    </main>
  `;
}

function productsPage() {
  return `
    <main>
      <h2>Our Products</h2>
      <label for="search">Search products</label>
      <input id="search" placeholder="Search by product or farmer">

      <label for="category">Filter by category</label>
      <select id="category">
        <option value="">All Categories</option>
        <option>Vegetables</option>
        <option>Fruits</option>
        <option>Root Crops</option>
        <option>Other</option>
      </select>

      <div id="product-list" class="grid">
        ${getProducts().map(productCard).join("")}
      </div>
    </main>
  `;
}

function productPage() {
  const id = new URLSearchParams(location.search).get("id");
  const product = getProducts().find(item => item.id === id);

  if (!product) {
    return `<main><h2>Product not found</h2>
      <a href="products.html">Back to Products</a></main>`;
  }

  return `
    <main>
      <section class="panel">
        <div class="product-icon">${escapeHTML(product.icon || "🌱")}</div>
        <h2>${escapeHTML(product.name)}</h2>
        <h3>${peso(product.price)} per unit</h3>
        ${stockLabel(Number(product.stock))}
        <p>${escapeHTML(product.description)}</p>
        <p><strong>Category:</strong> ${escapeHTML(product.category)}</p>
        <p><strong>Farmer:</strong> ${escapeHTML(product.farmer)}</p>
        <p><strong>Contact:</strong>
          <a href="tel:${escapeHTML(product.phone)}">
            ${escapeHTML(product.phone)}
          </a>
        </p>
        <p><strong>Farm location:</strong> ${escapeHTML(product.location)}</p>
        <a class="button" target="_blank" rel="noopener"
          href="${mapLink(product.location)}">View Farm Map</a>
        <button data-add="${escapeHTML(product.id)}"
          ${product.stock <= 0 ? "disabled" : ""}>Add to Cart</button>
      </section>
    </main>
  `;
}

function cartPage() {
  const cart = getCart();
  const products = getProducts();
  let total = 0;

  const rows = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return "";

    const subtotal = product.price * item.qty;
    total += subtotal;

    return `
      <tr>
        <td>${escapeHTML(product.name)}</td>
        <td>${peso(product.price)}</td>
        <td>
          <button class="secondary" data-minus="${product.id}">−</button>
          ${item.qty}
          <button class="secondary" data-plus="${product.id}">+</button>
        </td>
        <td>${peso(subtotal)}</td>
        <td><button class="danger" data-remove="${product.id}">Remove</button></td>
      </tr>
    `;
  }).join("");

  return `
    <main>
      <h2>Shopping Cart</h2>
      ${cart.length ? `
        <div class="panel">
          <table>
            <thead><tr>
              <th>Product</th><th>Price</th><th>Quantity</th>
              <th>Subtotal</th><th>Action</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <h3>Total: ${peso(total)}</h3>
          <a class="button" href="products.html">Continue Shopping</a>
          <a class="button" href="checkout.html">Proceed to Checkout</a>
        </div>
      ` : `
        <p>Your cart is empty.</p>
        <a class="button" href="products.html">Browse Products</a>
      `}
    </main>
  `;
}

function checkoutPage() {
  const cart = getCart();
  const products = getProducts();

  const total = cart.reduce((sum, item) => {
    const p = products.find(product => product.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);

  return `
    <main>
      <h2>Checkout</h2>
      ${cart.length ? `
        <section class="panel">
          <h3>Order Total: ${peso(total)}</h3>
          <form id="checkout-form">
            <label>Customer Name</label>
            <input name="customer" required>

            <label>Contact Number</label>
            <input name="phone" type="tel" required>

            <label>Delivery Address</label>
            <textarea name="address" required
              placeholder="House number, barangay, municipality"></textarea>

            <label>Google Maps link (optional)</label>
            <input name="map" type="url"
              placeholder="Paste your Google Maps link">

            <label>Payment Method</label>
            <select name="payment">
              <option>Cash on Delivery (Demo)</option>
              <option>Pay at Pickup (Demo)</option>
            </select>

            <button type="submit">Place Order</button>
          </form>
        </section>
      ` : `
        <p>Your cart is empty. Add products before checkout.</p>
        <a class="button" href="products.html">Browse Products</a>
      `}
    </main>
  `;
}

function ordersPage() {
  const orders = getOrders().slice().reverse();

  return `
    <main>
      <h2>My Orders</h2>
      ${orders.length ? orders.map(order => `
        <section class="panel">
          <h3>Order #${escapeHTML(order.id)}</h3>
          <p><strong>Customer:</strong> ${escapeHTML(order.customer)}</p>
          <p><strong>Delivery Address:</strong> ${escapeHTML(order.address)}</p>
          <p><strong>Order Status:</strong> ${escapeHTML(order.status)}</p>
          <p><strong>Total:</strong> ${peso(order.total)}</p>
          <h4>Items</h4>
          <ul>
            ${order.items.map(item => `
              <li>${escapeHTML(item.name)} × ${item.qty}
                — Farm: ${escapeHTML(item.location)}</li>
            `).join("")}
          </ul>
          ${order.map ? `<a target="_blank" rel="noopener"
            href="${escapeHTML(order.map)}">View Delivery Map</a>` : ""}
          <p><strong>Rider:</strong> ${escapeHTML(order.rider || "Not assigned yet")}</p>
          ${order.riderPhone ? `
            <p><strong>Rider Contact:</strong>
              <a href="tel:${escapeHTML(order.riderPhone)}">
                ${escapeHTML(order.riderPhone)}
              </a>
            </p>` : ""}
        </section>
      `).join("") : "<p>No orders yet.</p>"}
    </main>
  `;
}

function sellerPage() {
  return `
    <main>
      <h2>Seller Centre</h2>
      <section class="panel">
        <h3>Add a Product</h3>
        <form id="seller-form">
          <label>Product Name</label>
          <input name="name" required>

          <label>Category</label>
          <select name="category">
            <option>Vegetables</option>
            <option>Fruits</option>
            <option>Root Crops</option>
            <option>Other</option>
          </select>

          <label>Price per unit (₱)</label>
          <input name="price" type="number" min="0.01" step="0.01" required>

          <label>Available Stock</label>
          <input name="stock" type="number" min="0" step="1" required>

          <label>Farmer Name</label>
          <input name="farmer" required>

          <label>Contact Number</label>
          <input name="phone" type="tel" required>

          <label>Farm Location</label>
          <input name="location" required
            value="Alibagon, Cajidiocan, Romblon">

          <label>Description</label>
          <textarea name="description"></textarea>

          <label>Product Emoji (e.g. 🥬 🍌 🥔)</label>
          <input name="icon" value="🌱">

          <button type="submit">Add Product</button>
        </form>
      </section>

      <h3>Current Products</h3>
      <div class="grid">
        ${getProducts().map(product => `
          <section class="card">
            <h3>${escapeHTML(product.name)}</h3>
            <p>${peso(product.price)} | Stock: ${product.stock}</p>
            <p>Farmer: ${escapeHTML(product.farmer)}</p>
            <button class="danger" data-delete-product="${product.id}">
              Delete Product
            </button>
          </section>
        `).join("")}
      </div>
    </main>
  `;
}

function sellerOrdersPage() {
  const orders = getOrders().slice().reverse();

  return `
    <main>
      <h2>Manage Orders and Delivery</h2>
      ${orders.length ? orders.map(order => `
        <section class="panel">
          <h3>Order #${escapeHTML(order.id)}</h3>
          <p>Customer: ${escapeHTML(order.customer)}</p>
          <p>Contact: ${escapeHTML(order.phone)}</p>
          <p>Address: ${escapeHTML(order.address)}</p>
          <p>Total: ${peso(order.total)}</p>
          <p>Status: <strong>${escapeHTML(order.status)}</strong></p>

          <form data-order-form="${escapeHTML(order.id)}">
            <label>Rider Name</label>
            <input name="rider" value="${escapeHTML(order.rider || "")}">

            <label>Rider Contact Number</label>
            <input name="riderPhone" type="tel"
              value="${escapeHTML(order.riderPhone || "")}">

            <label>Update Order Status</label>
            <select name="status">
              ${["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"]
                .map(status => `
                  <option ${order.status === status ? "selected" : ""}>
                    ${status}
                  </option>`).join("")}
            </select>

            <button type="submit">Save Order Update</button>
          </form>
        </section>
      `).join("") : "<p>No customer orders yet.</p>"}
    </main>
  `;
}

const pageRenderers = {
  home: homePage,
  products: productsPage,
  product: productPage,
  cart: cartPage,
  checkout: checkoutPage,
  orders: ordersPage,
  seller: sellerPage,
  "seller-orders": sellerOrdersPage
};

function render() {
  const page = document.body.dataset.page || "home";
  const renderer = pageRenderers[page] || homePage;
  $("#app").innerHTML = header() + renderer() + footer() + bottomNavigation();
}

function addToCart(id) {
  const product = getProducts().find(p => p.id === id);
  if (!product || product.stock <= 0) {
    alert("This product is out of stock.");
    return;
  }

  const cart = getCart();
  const existing = cart.find(item => item.id === id);
  const currentQty = existing ? existing.qty : 0;

  if (currentQty >= product.stock) {
    alert("You have reached the available stock limit.");
    return;
  }

  if (existing) existing.qty++;
  else cart.push({ id, qty: 1 });

  save("agriCart", cart);
  alert("Product added to cart!");
  render();
}

document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) return addToCart(addButton.dataset.add);

  const plus = event.target.closest("[data-plus]");
  const minus = event.target.closest("[data-minus]");
  const remove = event.target.closest("[data-remove]");

  if (plus || minus || remove) {
    const id = (plus || minus || remove).dataset[
      plus ? "plus" : minus ? "minus" : "remove"
    ];

    let cart = getCart();
    const item = cart.find(row => row.id === id);

    if (remove) cart = cart.filter(row => row.id !== id);

    if (plus && item) {
      const product = getProducts().find(p => p.id === id);
      if (product && item.qty < product.stock) item.qty++;
      else alert("No more stock available.");
    }

    if (minus && item) {
      item.qty--;
      if (item.qty <= 0) cart = cart.filter(row => row.id !== id);
    }

    save("agriCart", cart);
    render();
  }

  const deleteButton = event.target.closest("[data-delete-product]");
  if (deleteButton) {
    if (confirm("Delete this product?")) {
      save("agriProducts", getProducts().filter(
        p => p.id !== deleteButton.dataset.deleteProduct
      ));
      render();
    }
  }
});

document.addEventListener("input", event => {
  if (event.target.id !== "search" &&
      event.target.id !== "category") return;

  const search = ($("#search")?.value || "").toLowerCase();
  const category = $("#category")?.value || "";

  const filtered = getProducts().filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.farmer.toLowerCase().includes(search);

    return matchesSearch &&
      (!category || product.category === category);
  });

  $("#product-list").innerHTML = filtered.map(productCard).join("");
});

document.addEventListener("submit", event => {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);

  if (form.id === "seller-form") {
    const products = getProducts();

    products.push({
      id: "p" + Date.now(),
      name: String(data.get("name")).trim(),
      category: data.get("category"),
      price: Number(data.get("price")),
      stock: Number(data.get("stock")),
      farmer: String(data.get("farmer")).trim(),
      phone: String(data.get("phone")).trim(),
      location: String(data.get("location")).trim(),
      description: String(data.get("description") || "").trim(),
      icon: String(data.get("icon") || "🌱").trim()
    });

    save("agriProducts", products);
    alert("Product added successfully!");
    render();
    return;
  }

  if (form.id === "checkout-form") {
    const cart = getCart();
    const products = getProducts();

    if (!cart.length) {
      alert("Your cart is empty.");
      return;
    }

    for (const item of cart) {
      const product = products.find(p => p.id === item.id);
      if (!product || item.qty > product.stock) {
        alert("Some products no longer have enough stock. Please review your cart.");
        return;
      }
    }

    const items = cart.map(item => {
      const product = products.find(p => p.id === item.id);
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        qty: item.qty,
        location: product.location,
        farmer: product.farmer
      };
    });

    const total = items.reduce(
      (sum, item) => sum + item.price * item.qty, 0
    );

    const orders = getOrders();
    const order = {
      id: String(Date.now()).slice(-8),
      customer: String(data.get("customer")).trim(),
      phone: String(data.get("phone")).trim(),
      address: String(data.get("address")).trim(),
      map: String(data.get("map") || "").trim(),
      payment: data.get("payment"),
      items,
      total,
      status: "Pending",
      rider: "",
      riderPhone: ""
    };

    for (const item of cart) {
      const product = products.find(p => p.id === item.id);
      product.stock -= item.qty;
    }

    orders.push(order);
    save("agriProducts", products);
    save("agriOrders", orders);
    save("agriCart", []);

    alert("Order placed! Your order number is " + order.id);
    location.href = "orders.html";
    return;
  }

  const orderId = form.dataset.orderForm;
  if (orderId) {
    const orders = getOrders();
    const order = orders.find(item => item.id === orderId);
    if (!order) return;

    order.rider = String(data.get("rider") || "").trim();
    order.riderPhone = String(data.get("riderPhone") || "").trim();
    order.status = data.get("status");

    save("agriOrders", orders);
    alert("Order information updated.");
    render();
  }
});

render();