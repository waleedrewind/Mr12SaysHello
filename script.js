// Product data: edit this array to replace products later.
const products = [
  { id: 'polo-001', name: 'Classic Green Polo', description: 'A soft, everyday polo in a rich forest-green finish.', price: 39.99, image: 'assets/classic-green-polo.svg' },
  { id: 'tee-002', name: 'Run Club T-Shirt', description: 'Breathable performance cotton for the miles ahead.', price: 29.99, image: 'assets/run-club-tshirt.svg' },
  { id: 'tee-003', name: 'Senator Graphic T-Shirt', description: 'A relaxed-fit graphic tee made for everyday wear.', price: 24.99, image: 'assets/senator-graphic-tshirt.svg' }
];

let cart = [];
let lastFocusedElement;
const money = value => `$${value.toFixed(2)}`;

function pushEvent(eventData) {
  window.dataLayer.push(eventData);
  console.log('dataLayer event:', eventData);
}

function gaItem(product, quantity = 1) {
  return { item_id: product.id, item_name: product.name, price: product.price, quantity };
}

function cartItems() { return cart.map(item => gaItem(item, item.quantity)); }
function cartTotal() { return cart.reduce((total, item) => total + item.price * item.quantity, 0); }

function renderProducts() {
  document.getElementById('product-grid').innerHTML = products.map(product => `
    <article class="product-card card">
      <img class="product-image" src="${product.image}" alt="${product.name}" />
      <div class="product-copy">
        <h2>${product.name}</h2><p>${product.description}</p>
        <div class="product-footer"><span class="price">${money(product.price)}</span>
          <div class="product-actions">
            <button class="button button-secondary" type="button" data-view="${product.id}">View Product</button>
            <button class="button button-primary" type="button" data-add="${product.id}">Add to Cart</button>
          </div>
        </div>
      </div>
    </article>`).join('');
}

function updateCart() {
  document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  const items = document.getElementById('cart-items');
  items.innerHTML = cart.length ? cart.map(item => `<div class="cart-item"><div><div class="cart-item-name">${item.name}</div><div class="cart-item-meta">Qty: ${item.quantity} × ${money(item.price)}</div></div><button class="remove-item" type="button" data-remove="${item.id}">Remove</button></div>`).join('') : '<p class="empty-cart">Your cart is empty. Add a product to begin testing.</p>';
  document.getElementById('cart-total').textContent = money(cartTotal());
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  updateCart();
  pushEvent({ event: 'add_to_cart', ecommerce: { currency: 'USD', value: product.price, items: [gaItem(product)] } });
}

function viewProduct(id) {
  const product = products.find(item => item.id === id);
  pushEvent({ event: 'view_item', ecommerce: { currency: 'USD', value: product.price, items: [gaItem(product)] } });
}

function showPage(page) {
  document.querySelectorAll('[data-page-panel]').forEach(panel => { const active = panel.dataset.pagePanel === page; panel.hidden = !active; panel.classList.toggle('active', active); });
  document.getElementById('checkout-page').hidden = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setFeedback(id, message, type) { const el = document.getElementById(id); el.textContent = message; el.className = `form-feedback ${type}`; }
function validEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }

function openCart() { lastFocusedElement = document.activeElement; updateCart(); document.getElementById('cart-modal').hidden = false; document.querySelector('.close-button').focus(); }
function closeCart() { document.getElementById('cart-modal').hidden = true; if (lastFocusedElement) lastFocusedElement.focus(); }
function viewCart() { pushEvent({ event: 'view_cart', ecommerce: { currency: 'USD', value: cartTotal(), items: cartItems() } }); }

function checkout() {
  if (!cart.length) return;
  pushEvent({ event: 'begin_checkout', ecommerce: { currency: 'USD', value: cartTotal(), items: cartItems() } });
  closeCart(); document.querySelectorAll('[data-page-panel]').forEach(panel => panel.hidden = true);
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  const checkout = document.getElementById('checkout-page'); checkout.hidden = false;
  document.getElementById('place-order').disabled = false;
  document.getElementById('order-feedback').textContent = '';
  document.getElementById('checkout-summary').innerHTML = cart.map(item => `<div class="summary-row"><span>${item.name} × ${item.quantity}</span><span>${money(item.price * item.quantity)}</span></div>`).join('') + `<div class="summary-row summary-total"><span>Total</span><span>${money(cartTotal())}</span></div>`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  renderProducts(); updateCart();
  document.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => {
    showPage(link.dataset.page);
    document.querySelectorAll('.nav-link').forEach(navLink => navLink.classList.toggle('active', navLink === link));
  }));
  document.querySelector('.brand').addEventListener('click', event => { event.preventDefault(); showPage('lead-gen'); document.querySelectorAll('.nav-link').forEach((link, index) => link.classList.toggle('active', index === 0)); });
  document.getElementById('cart-button').addEventListener('click', openCart);
  document.querySelectorAll('[data-close-cart]').forEach(button => button.addEventListener('click', closeCart));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !document.getElementById('cart-modal').hidden) closeCart(); });
  document.getElementById('product-grid').addEventListener('click', event => { if (event.target.dataset.view) viewProduct(event.target.dataset.view); if (event.target.dataset.add) addToCart(event.target.dataset.add); });
  document.getElementById('cart-items').addEventListener('click', event => { if (event.target.dataset.remove) { cart = cart.filter(item => item.id !== event.target.dataset.remove); updateCart(); } });
  document.getElementById('view-cart').addEventListener('click', viewCart);
  document.getElementById('checkout-button').addEventListener('click', checkout);
  document.getElementById('back-to-shop').addEventListener('click', () => { showPage('ecommerce'); document.querySelectorAll('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.page === 'ecommerce')); });
  document.getElementById('place-order').addEventListener('click', () => {
    if (!cart.length) return;
    const total = cartTotal(); const items = cartItems();
    pushEvent({ event: 'purchase', ecommerce: { transaction_id: `TEST-${Date.now()}`, currency: 'USD', value: total, items } });
    cart = []; updateCart();
    document.getElementById('checkout-summary').innerHTML = '';
    document.getElementById('place-order').disabled = true;
    setFeedback('order-feedback', 'Order completed successfully!', 'success');
  });
  document.getElementById('contact-form').addEventListener('submit', event => { event.preventDefault(); const form = event.currentTarget; const name = form.elements.name.value.trim(); const email = form.elements.email.value.trim(); if (!name || !validEmail(email)) return setFeedback('contact-feedback', 'Please enter your full name and a valid email address.', 'error'); pushEvent({ event: 'form_submit', form_name: 'contact_form' }); form.reset(); setFeedback('contact-feedback', 'Thanks! Your test form submission was successful.', 'success'); });
  document.getElementById('newsletter-form').addEventListener('submit', event => { event.preventDefault(); const form = event.currentTarget; const email = form.elements.email.value.trim(); if (!validEmail(email)) return setFeedback('newsletter-feedback', 'Please enter a valid email address.', 'error'); pushEvent({ event: 'newsletter_signup', form_name: 'newsletter' }); form.reset(); setFeedback('newsletter-feedback', 'You are subscribed — the test event was sent.', 'success'); });
});
