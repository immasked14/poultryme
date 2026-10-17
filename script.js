document.addEventListener('DOMContentLoaded', () => {
  let products = getProducts();
  let cart = getCart();
  let currentCategory = 'all';
  let sortMode = 'default';

  const grid = document.getElementById('product-grid');
  const countEl = document.getElementById('product-count');
  const searchInput = document.getElementById('search');
  const sortSelect = document.getElementById('sort');
  const modal = document.getElementById('modal');
  const cartPanel = document.getElementById('cart-panel');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  function filteredProducts() {
    const q = (searchInput.value || '').toLowerCase();
    let list = products.filter(p => {
      const matchCat = currentCategory === 'all' || p.ageGroup === currentCategory;
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.breed.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
    if (sortMode === 'low') list.sort((a,b) => a.price - b.price);
    if (sortMode === 'high') list.sort((a,b) => b.price - a.price);
    return list;
  }

  function renderProducts() {
    const list = filteredProducts();
    grid.innerHTML = '';
    if (!list.length) {
      grid.innerHTML = '<div class="empty-msg">No chickens match your search/filter.</div>';
      countEl.textContent = '0 products';
      return;
    }
    countEl.textContent = list.length + ' product' + (list.length>1?'s':'');
    list.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}" onerror="this.src='https://placehold.co/400x300?text=Chicken'">
        <div class="product-body">
          <h3>${p.name}</h3>
          <div class="breed">${p.breed} • ${p.age}</div>
          <div class="price">${formatPeso(p.price)}</div>
          <p>${p.description}</p>
          <span class="badge ${p.availability==='In Stock'?'in':'out'}">${p.availability}</span>
          <div class="product-actions">
            <button class="btn-view" data-id="${p.id}">View Details</button>
            <button class="btn-add" data-id="${p.id}" ${p.availability!=='In Stock'?'disabled':''}>Add to Cart</button>
          </div>
        </div>`;
      grid.appendChild(card);
    });
  }

  grid.addEventListener('click', e => {
    const v = e.target.closest('.btn-view');
    const a = e.target.closest('.btn-add');
    if (v) openModal(Number(v.dataset.id));
    if (a) addToCart(Number(a.dataset.id));
  });

  function openModal(id) {
    const p = products.find(x=>x.id===id);
    if (!p) return;
    document.getElementById('modal-img').src = p.image;
    document.getElementById('modal-img').alt = p.name;
    document.getElementById('modal-name').textContent = p.name;
    document.getElementById('modal-breed').textContent = p.breed;
    document.getElementById('modal-age').textContent = p.age;
    document.getElementById('modal-price').textContent = formatPeso(p.price);
    document.getElementById('modal-avail').textContent = p.availability;
    document.getElementById('modal-desc').textContent = p.description;
    document.getElementById('modal-purpose').textContent = p.purpose;
    modal.classList.add('open');
  }
  document.getElementById('modal-close').addEventListener('click', ()=>modal.classList.remove('open'));
  modal.addEventListener('click', e=>{ if(e.target===modal) modal.classList.remove('open'); });

  function addToCart(id) {
    const p = products.find(x=>x.id===id);
    if (!p || p.availability!=='In Stock') return;
    const item = cart.find(x=>x.id===id);
    if (item) item.qty += 1; else cart.push({id:p.id,name:p.name,price:p.price,qty:1});
    saveCart(cart);
    updateCartUI();
  }

  function updateCartUI() {
    document.getElementById('cart-count').textContent = cart.reduce((s,i)=>s+i.qty,0);
    cartItems.innerHTML = '';
    if (!cart.length) { cartItems.innerHTML = '<p>Your cart is empty.</p>'; cartTotal.textContent = formatPeso(0); return; }
    let total = 0;
    cart.forEach(item => {
      total += item.price*item.qty;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `<h4>${item.name}</h4><div class="row"><span>${formatPeso(item.price)}</span><input class="qty-input" type="number" min="1" value="${item.qty}" data-id="${item.id}"><button data-remove="${item.id}">Remove</button></div><div>Subtotal: ${formatPeso(item.price*item.qty)}</div>`;
      cartItems.appendChild(div);
    });
    cartTotal.textContent = formatPeso(total);
  }

  cartItems.addEventListener('change', e => {
    if (e.target.classList.contains('qty-input')) {
      const id = Number(e.target.dataset.id);
      const item = cart.find(x=>x.id===id);
      if (item) { item.qty = Math.max(1, Number(e.target.value)||1); saveCart(cart); updateCartUI(); }
    }
  });
  cartItems.addEventListener('click', e => {
    const r = e.target.dataset.remove;
    if (r) { cart = cart.filter(x=>x.id!==Number(r)); saveCart(cart); updateCartUI(); }
  });

  document.getElementById('cart-btn').addEventListener('click', ()=>cartPanel.classList.toggle('open'));
  document.getElementById('cart-close').addEventListener('click', ()=>cartPanel.classList.remove('open'));

  document.querySelectorAll('[data-cat]').forEach(b => {
    b.addEventListener('click', () => { currentCategory = b.dataset.cat; renderProducts(); document.getElementById('shop').scrollIntoView({behavior:'smooth'}); });
  });
  searchInput.addEventListener('input', renderProducts);
  sortSelect.addEventListener('change', e => { sortMode = e.target.value; renderProducts(); });

  document.getElementById('shop-now').addEventListener('click', ()=>document.getElementById('shop').scrollIntoView({behavior:'smooth'}));
  document.getElementById('learn-more').addEventListener('click', ()=>document.getElementById('about').scrollIntoView({behavior:'smooth'}));

  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }
    document.getElementById('contact-msg').textContent = 'Demo: your message was not actually sent. Thank you!';
    contactForm.reset();
  });

  renderProducts();
  updateCartUI();
});
