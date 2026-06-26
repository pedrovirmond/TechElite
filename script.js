const products = [
  {
    id: "elitebook",
    name: "EliteBook Pro X1 Carbon Edition",
    category: "laptops",
    categoryLabel: "Laptops",
    price: 1899,
    priceText: "$1,899",
    tag: "34% off",
    reviews: 324,
    image: "assets/product1.png",
    specs: ["Intel Core i9", "32GB RAM", "1TB SSD", "Carbon Body"],
    description: "Notebook premium para produtividade, estudo e criacao, com corpo leve em fibra de carbono e desempenho profissional."
  },
  {
    id: "nexus",
    name: "Nexus Ultra 5G Smartphone",
    category: "smartphones",
    categoryLabel: "Smartphones",
    price: 999,
    priceText: "$999",
    tag: "New Arrival",
    reviews: 88,
    image: "assets/product2.png",
    specs: ["5G", "OLED Display", "256GB", "Triple Camera"],
    description: "Smartphone 5G com tela OLED, cameras avancadas e bateria para o dia todo."
  },
  {
    id: "sonicwave",
    name: "SonicWave Studio Max",
    category: "audio",
    categoryLabel: "Audio",
    price: 349,
    priceText: "$349",
    tag: "34% off",
    reviews: 210,
    image: "assets/product3.png",
    specs: ["ANC", "Spatial Audio", "40h Battery", "Bluetooth 5.3"],
    description: "Fones premium com cancelamento de ruido e som imersivo para trabalho, estudo e entretenimento."
  },
  {
    id: "prodisplay",
    name: "ProDisplay 4K Ultra-Wide",
    category: "displays",
    categoryLabel: "Displays",
    price: 749,
    priceText: "$749",
    tag: "New",
    reviews: 86,
    image: "assets/product4.png",
    specs: ["4K Ultra-Wide", "HDR", "USB-C", "Color Pro"],
    description: "Monitor ultra-wide para criadores e profissionais que precisam de espaco, nitidez e fidelidade de cor."
  },
  {
    id: "tabpro",
    name: "TabPro T2 Creator Edition",
    category: "smartphones",
    categoryLabel: "Smartphones",
    price: 1099,
    priceText: "$1,099",
    tag: "20% off",
    reviews: 92,
    image: "assets/product5.png",
    specs: ["Pen Support", "12.9 Display", "512GB", "Creator Apps"],
    description: "Tablet para criacao e anotacoes com tela ampla, caneta precisa e armazenamento generoso."
  },
  {
    id: "coremaster",
    name: "CoreMaster X-900 GPU",
    category: "components",
    categoryLabel: "Components",
    price: 1599,
    priceText: "$1,599",
    tag: "31% off",
    reviews: 45,
    image: "assets/product6.png",
    specs: ["RTX Class", "24GB VRAM", "Ray Tracing", "AI Boost"],
    description: "Placa de video de alto desempenho para renderizacao, jogos e tarefas com inteligencia artificial."
  }
];

const state = {
  filter: "all",
  selectedCompare: [],
  cart: [],
  currentProduct: products[0]
};

const screens = document.querySelectorAll(".phone-screen");
const productGrid = document.querySelector("#productGrid");
const chips = document.querySelectorAll("[data-filter]");
const compareDock = document.querySelector("#compareDock");
const compareCounter = document.querySelector("#compareCounter");
const goCompare = document.querySelector("#goCompare");
const toast = document.querySelector("#toast");
const cartBadge = document.querySelector("#cartBadge");
const cartBadgeCopies = document.querySelectorAll(".cart-badge-copy");
const chipRow = document.querySelector(".chip-row");
const successPanel = document.querySelector("#successPanel");
let chipDragStart = null;

function currency(value) {
  return `$${value.toLocaleString("en-US")}`;
}

function ratingMarkup(reviews) {
  return `${Array.from({ length: 5 }, (_, index) => `<img src="assets/rating-star-${index + 1}.svg" alt="" />`).join("")}<span>(${reviews})</span>`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function showScreen(name) {
  successPanel.hidden = true;
  screens.forEach((screen) => screen.classList.toggle("active", screen.dataset.screen === name));
  document.querySelectorAll("[data-nav]").forEach((item) => {
    item.classList.toggle("active", item.dataset.nav === name);
  });
  if (name === "compare") renderCompare();
  if (name === "cart") renderCart();
}

function renderProducts() {
  const visibleProducts = products.filter((product) => state.filter === "all" || product.category === state.filter);
  productGrid.innerHTML = visibleProducts.map((product) => {
    const checked = state.selectedCompare.includes(product.id) ? "checked" : "";
    return `
      <article class="product-card" data-product="${product.id}">
        <label class="compare-check">
          <input type="checkbox" value="${product.id}" ${checked} />
          Compare
        </label>
        <button class="product-image-button" type="button" data-open="${product.id}" aria-label="Abrir ${product.name}">
          <img class="product-image" src="${product.image}" alt="${product.name}" />
        </button>
        <div class="rating">${ratingMarkup(product.reviews)}</div>
        <h2>${product.name}</h2>
        <span class="tag">${product.tag}</span>
        <div class="price-row">
          <strong>${product.priceText}</strong>
          <button class="add-cart" type="button" data-add="${product.id}" aria-label="Adicionar ${product.name} ao carrinho">
            <img src="assets/add-button-1.svg" alt="" />
          </button>
        </div>
      </article>
    `;
  }).join("");
  updateCompareDock();
}

function updateCompareDock() {
  const count = state.selectedCompare.length;
  compareDock.hidden = count !== 2;
  compareCounter.textContent = `${count} produto${count === 1 ? "" : "s"} selecionado${count === 1 ? "" : "s"}`;
}

function selectProduct(id) {
  state.currentProduct = products.find((product) => product.id === id) || products[0];
  const product = state.currentProduct;
  document.querySelector("#detailsBreadcrumb").textContent = `Shop > ${product.categoryLabel} > ${product.name}`;
  document.querySelector("#detailsImage").src = product.image;
  document.querySelector("#detailsImage").alt = product.name;
  document.querySelector("#detailsTag").textContent = product.tag;
  document.querySelector("#detailsTitle").textContent = product.name;
  document.querySelector("#detailsRating").innerHTML = ratingMarkup(product.reviews);
  document.querySelector("#detailsPrice").textContent = product.priceText;
  document.querySelector("#detailsInstallments").textContent = `Or ${currency(Math.round(product.price / 12))}/mo for 12 months`;
  document.querySelector("#detailsSpecs").innerHTML = product.specs.map((spec) => `<span>${spec}</span>`).join("");
  document.querySelector("#detailsDescription").textContent = product.description;
  showScreen("details");
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  state.cart.push(product);
  updateCartBadges();
  showToast(`${product.name} adicionado ao carrinho`);
}

function updateCartBadges() {
  const total = state.cart.length;
  cartBadge.textContent = total;
  cartBadgeCopies.forEach((badge) => {
    badge.textContent = total;
  });
}

function handleCompareChange(input) {
  const id = input.value;
  if (input.checked && state.selectedCompare.length >= 2 && !state.selectedCompare.includes(id)) {
    input.checked = false;
    showToast("Selecione no maximo dois produtos para comparar");
    return;
  }
  if (input.checked) {
    state.selectedCompare = [...state.selectedCompare, id].slice(0, 2);
  } else {
    state.selectedCompare = state.selectedCompare.filter((item) => item !== id);
  }
  updateCompareDock();
}

function renderCompare() {
  const selected = state.selectedCompare.length === 2
    ? state.selectedCompare.map((id) => products.find((product) => product.id === id))
    : products.slice(0, 2);

  document.querySelector("#compareItems").innerHTML = selected.map((product) => `
    <article class="compare-item">
      <img src="${product.image}" alt="${product.name}" />
      <div class="rating">${ratingMarkup(product.reviews)}</div>
      <h3>${product.name}</h3>
      <strong>${product.priceText}</strong>
    </article>
  `).join("");

  const rows = ["Categoria", "Preco", "Destaque 1", "Destaque 2", "Destaque 3", "Destaque 4"];
  document.querySelector("#specGrid").innerHTML = rows.map((row, index) => selected.map((product) => {
    const value = index === 0 ? product.categoryLabel : index === 1 ? product.priceText : product.specs[index - 2];
    return `<div class="spec"><span>${row}</span><strong>${value}</strong></div>`;
  }).join("")).join("");

  document.querySelector("#compareAddFirst").textContent = `Add ${selected[0].name.split(" ")[0]} to Cart`;
  document.querySelector("#compareAddSecond").textContent = `Add ${selected[1].name.split(" ")[0]} to Cart`;
  document.querySelector("#compareAddFirst").dataset.add = selected[0].id;
  document.querySelector("#compareAddSecond").dataset.add = selected[1].id;
}

function renderCart() {
  successPanel.hidden = true;
  const cartItems = document.querySelector("#cartItems");
  if (state.cart.length === 0) {
    cartItems.innerHTML = `<div class="empty-cart">Seu carrinho esta vazio. Adicione um produto pela tela Shop.</div>`;
  } else {
    cartItems.innerHTML = state.cart.map((product, index) => `
      <article class="cart-item">
        <img src="${product.image}" alt="${product.name}" />
        <div class="cart-item-content">
          <h3>${product.name}</h3>
          <div class="cart-item-actions">
            <strong>${product.priceText}</strong>
            <button class="remove-cart" type="button" data-remove-cart="${index}" aria-label="Remover ${product.name} do carrinho">Remover</button>
          </div>
        </div>
      </article>
    `).join("");
  }
  const subtotal = state.cart.reduce((sum, product) => sum + product.price, 0);
  const discount = Math.round(subtotal * 0.1);
  document.querySelector("#subtotalValue").textContent = currency(subtotal);
  document.querySelector("#discountValue").textContent = `-${currency(discount)}`;
  document.querySelector("#totalValue").textContent = currency(subtotal - discount);
}

function removeFromCart(index) {
  const [removed] = state.cart.splice(index, 1);
  updateCartBadges();
  renderCart();
  if (removed) showToast(`${removed.name} removido do carrinho`);
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    state.filter = chip.dataset.filter;
    chips.forEach((item) => item.classList.toggle("active", item === chip));
    renderProducts();
  });
});

chipRow.addEventListener("wheel", (event) => {
  if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
  event.preventDefault();
  chipRow.scrollLeft += event.deltaY;
}, { passive: false });

chipRow.addEventListener("pointerdown", (event) => {
  chipDragStart = {
    x: event.clientX,
    scrollLeft: chipRow.scrollLeft
  };
  chipRow.classList.add("dragging");
});

chipRow.addEventListener("pointermove", (event) => {
  if (!chipDragStart) return;
  event.preventDefault();
  chipRow.scrollLeft = chipDragStart.scrollLeft - (event.clientX - chipDragStart.x);
});

["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
  chipRow.addEventListener(eventName, () => {
    chipDragStart = null;
    chipRow.classList.remove("dragging");
  });
});

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const openButton = event.target.closest("[data-open]");
  const compareLabel = event.target.closest(".compare-check");
  const productCard = event.target.closest(".product-card");

  if (addButton) {
    addToCart(addButton.dataset.add);
    return;
  }
  if (compareLabel) {
    return;
  }
  if (openButton) {
    selectProduct(openButton.dataset.open);
    return;
  }
  if (productCard) {
    selectProduct(productCard.dataset.product);
  }
});

productGrid.addEventListener("change", (event) => {
  const compareInput = event.target.closest(".compare-check input");
  if (compareInput) handleCompareChange(compareInput);
});

document.querySelectorAll("[data-nav]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.nav;
    if (target === "compare" && state.selectedCompare.length !== 2) {
      showToast("Selecione dois produtos na tela Shop para comparar");
      showScreen("shop");
      return;
    }
    showScreen(target);
  });
});

goCompare.addEventListener("click", () => showScreen("compare"));

document.querySelector("#detailsAddCart").addEventListener("click", () => {
  addToCart(state.currentProduct.id);
});

document.querySelector("#detailsCompare").addEventListener("click", () => {
  if (!state.selectedCompare.includes(state.currentProduct.id)) {
    if (state.selectedCompare.length >= 2) state.selectedCompare.shift();
    state.selectedCompare.push(state.currentProduct.id);
  }
  renderProducts();
  showScreen("shop");
  showToast("Produto marcado para comparacao");
});

document.querySelectorAll(".payment-option").forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelectorAll(".payment-option").forEach((item) => item.classList.remove("active"));
    option.classList.add("active");
    option.querySelector("input").checked = true;
    renderCart();
  });
});

document.querySelector("#cartItems").addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-cart]");
  if (!removeButton) return;
  removeFromCart(Number(removeButton.dataset.removeCart));
});

document.querySelector("#copyPix").addEventListener("click", () => {
  navigator.clipboard?.writeText("techelite-pix-checkout");
  showToast("Chave Pix copiada");
});

document.querySelector("#finishPayment").addEventListener("click", () => {
  if (!state.cart.length) {
    showToast("Adicione um produto antes de finalizar");
    return;
  }
  successPanel.hidden = false;
  showToast("Compra concluida");
});

document.querySelector("#continueShopping").addEventListener("click", () => {
  state.cart = [];
  updateCartBadges();
  renderCart();
  showScreen("shop");
});

renderProducts();
updateCartBadges();
