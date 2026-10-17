// Shared product data + localStorage helpers for PoultryMe
const STORAGE_KEY = 'poultryme_products';
const CART_KEY = 'poultryme_cart';

const DEFAULT_PRODUCTS = [
  { id: 1, name: 'White Leghorn', breed: 'White Leghorn', age: '4 Months', ageGroup: '4', price: 350, image: 'images/pexels.jpg', availability: 'In Stock', description: 'Excellent egg layer with high productivity.', purpose: 'Egg-laying' },
  { id: 2, name: 'Rhode Island Red', breed: 'Rhode Island Red', age: '5 Months', ageGroup: '5', price: 420, image: 'images/pixabay.jpg', availability: 'In Stock', description: 'Hardy dual-purpose breed, great for eggs and meat.', purpose: 'Dual-purpose' },
  { id: 3, name: 'Black Australorp', breed: 'Black Australorp', age: '6 Months', ageGroup: '6+', price: 480, image: 'images/unsplash.jpg', availability: 'In Stock', description: 'Calm temperament and reliable egg production.', purpose: 'Egg-laying' },
  { id: 4, name: 'Sussex', breed: 'Sussex', age: '4 Months', ageGroup: '4', price: 450, image: 'images/CIx5pi6Jzwz4-4IBWzcB3xsRVezoPFeehWw8B2am4rOsrQd15CG-vuIbgicowWvllMM_E_8mbquvNVumGa38SRS2GWgwOKKwp-AtmcUKs9ZLyvNrihv9jfNnvokIBkMkI-pQyakMBFOZJj0rgGrpsJLvTMmoTNd9VsN9RbvOzHeWKQIVh_e8TCYcdox8Ds_d.jpg', availability: 'Out of Stock', description: 'Friendly and productive, ideal for backyard flocks.', purpose: 'Dual-purpose' },
  { id: 5, name: 'Plymouth Rock', breed: 'Plymouth Rock', age: '5 Months', ageGroup: '5', price: 550, image: 'images/Km2T_mB8opmp7jYrfjFMrUZ5_4DZ7UW4uUstCPHC8UbKIhjS7h2MGf43IeD-Dhc-mUgAcs8SyBT3WsG1Ov5i9V6RstukIYi7dAk_NRIsfPYPTWyINXxwgEdW5cJJ15KKTRkkBRqmrFa4wjbEx3xjIRNT8Bk6TuUONCDCtBUDxLZH-O3Yr7qRKwlVeA0U1rsz.jpg', availability: 'In Stock', description: 'Cold-hardy breed with consistent laying.', purpose: 'Egg-laying' },
  { id: 6, name: 'Asil', breed: 'Asil', age: '6 Months', ageGroup: '6+', price: 600, image: 'images/MPJEeM1p0IE76xavatgETg1iKOpB7A2sk5aJfnP6vYDAb3iFvLjDtOOxUXh1XUhBMUZi9reKu84Le88zjc9DrpA8AGXFZGP3VjMQQSeG6gk8aSJE24WMRsl70-oErSQ-6AdSEM-SIn9VXUfcyKygS3iee1Qpqc6wQZJKErCueAuzyLTYugSC2L_oDEKR7YqJ.jpg', availability: 'In Stock', description: 'Strong, athletic breed suited for breeding.', purpose: 'Breeding' }
];

function getProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch (e) {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  return JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function formatPeso(n) {
  return '₱' + Number(n).toLocaleString('en-PH');
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch (e) { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
