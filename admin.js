document.addEventListener('DOMContentLoaded', () => {
  let products = getProducts();
  const tableBody = document.getElementById('product-table-body');
  const form = document.getElementById('add-form');
  const filterAge = document.getElementById('filter-age');
  const filterAvail = document.getElementById('filter-avail');

  function renderCards() {
    const total = products.length;
    const avail = products.filter(p=>p.availability==='In Stock').length;
    const out = total - avail;
    const value = products.reduce((s,p)=>s+p.price,0);
    document.getElementById('total-products').textContent = total;
    document.getElementById('available').textContent = avail;
    document.getElementById('outstock').textContent = out;
    document.getElementById('inv-value').textContent = formatPeso(value);
  }

  function filtered() {
    return products.filter(p => {
      const a = filterAge.value === 'all' || p.ageGroup === filterAge.value;
      const v = filterAvail.value === 'all' || p.availability === filterAvail.value;
      return a && v;
    });
  }

  function renderTable() {
    tableBody.innerHTML = '';
    filtered().forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${p.image}" alt="${p.name}" style="width:60px;height:45px;object-fit:cover;border-radius:6px" onerror="this.src='https://placehold.co/60x45?text=?'"></td>
        <td>${p.name}</td>
        <td>${p.breed}</td>
        <td>${p.age}</td>
        <td>${formatPeso(p.price)}</td>
        <td>${p.availability}</td>
        <td>
          <button data-edit="${p.id}">Edit</button>
          <button data-del="${p.id}">Delete</button>
        </td>`;
      tableBody.appendChild(tr);
    });
    renderCards();
    const es = document.getElementById('empty-state');
    if (es) es.style.display = filtered().length ? 'none' : 'block';
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    const newP = {
      id: Date.now(),
      name: fd.get('name'),
      breed: fd.get('breed'),
      age: fd.get('age'),
      ageGroup: fd.get('ageGroup'),
      price: Number(fd.get('price')),
      image: fd.get('image') || 'pexels.jpg',
      availability: fd.get('availability'),
      description: fd.get('description'),
      purpose: fd.get('purpose')
    };
    products.push(newP);
    saveProducts(products);
    form.reset();
    renderTable();
  });

  tableBody.addEventListener('click', e => {
    const editId = e.target.dataset.edit;
    const delId = e.target.dataset.del;
    if (delId) {
      if (!confirm('Delete this chicken?')) return;
      products = products.filter(p=>p.id!==Number(delId));
      saveProducts(products);
      renderTable();
    }
    if (editId) {
      const p = products.find(x=>x.id===Number(editId));
      if (!p) return;
      const name = prompt('Name', p.name);
      if (name===null) return;
      p.name = name;
      p.breed = prompt('Breed', p.breed) ?? p.breed;
      p.age = prompt('Age', p.age) ?? p.age;
      p.price = Number(prompt('Price', p.price)) || p.price;
      p.availability = prompt('Availability (In Stock/Out of Stock)', p.availability) ?? p.availability;
      p.description = prompt('Description', p.description) ?? p.description;
      saveProducts(products);
      renderTable();
    }
  });

  filterAge.addEventListener('change', renderTable);
  filterAvail.addEventListener('change', renderTable);

  renderTable();
});
