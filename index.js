const catalog = document.querySelector('.catalog');
const cartList = document.querySelector('.cart__list');
const cartElem = document.querySelector('.cart');
const cartButton = document.querySelector('.header__cart__icon');

const totalPriceElem = document.querySelector('.total-price');
const totalAmountElem = document.querySelector('.total-amount');


cartButton.addEventListener('click', () => {
    cartElem.classList.toggle('cart__active');
})


const productsList = [
    {
        id: 1,
        name: 'Burger',
        img: './static/burger.jpg',
        price: 5,
        quantity: 10,
    },
    {
        id: 2,
        name: 'French fries',
        img: './static/frenchFries.jpg',
        price: 3,
        quantity: 30,
    },
    {
        id: 3,
        name: 'Coca-Cola',
        img: './static/coca.jpg',
        price: 2,
        quantity: 100,
    },
   
];

const cart = [];

function findProductIndex(arr, id) {
    return arr.findIndex(item => item.id === id);
}

function updateDOM() {
    renderProducts();
    renderCart();
    renderTotalValues();
}

function renderTotalValues(){
    const totalValues = cart.reduce((total, product) => {
        total.price += product.price * product.buyQuantity;
        total.amount += product.buyQuantity
        return total;
    }, {price: 0, amount: 0});
    
    totalPriceElem.textContent = totalValues.price + '$';
    totalAmountElem.textContent = totalValues.amount;
}

function renderProducts() {
    catalog.innerHTML = '';
    productsList.forEach(product => {
        const card = createProductCard(product);
        catalog.appendChild(card);
    });
}

function renderCart() {
    cartList.innerHTML = '';
    cart.forEach(product => {
        const card = createCartCard(product);
        cartList.appendChild(card);
    });
}

function createCard(product, type) {
    const isCart = type === 'cart';
    const purchasedQuantity = cart.find(item => item.id === product.id)?.buyQuantity || 0;
    const availableQuantity = product.quantity -  purchasedQuantity;

    const card = document.createElement('div');
    card.classList.add(isCart ? 'cart__list__elem' : 'product-card');
    card.dataset.id = product.id;

    card.innerHTML = `
        
        ${isCart ? `
        <div class="cart__list__elem__img">
            <img src="${product.img}" alt="">
        </div>
        <div class="cart__list__elem__info">
            <h5>${product.name}</h5>
            <span>${product.price * product.buyQuantity}$</span>
        </div>
        <div class="cart__list__elem__quantity">
            <button class="decrease-btn">-</button>
            <span class='cart-quantity'>${product.buyQuantity}</span>
            <button  class="increase-btn">+</button>

        </div>
        <div class="cart__list__elem__delete">
            <img src="./static/delete.png" alt="">
        </div>
    ` : `
        <div class="product-card__img">
            <img src="${product.img}" alt="">
        </div>
        <div class="product-card__info">
            <h5 class="product-card__title">${product.name}</h5>
            <div class="product-card__price">
                <span>Price:</span>
                <span>${product.price}$</span>
            </div>
            <div class="product-card__quantity">
                <span>Quantity:</span>
                <span class="quantity">${availableQuantity}</span>
            </div>
            <div class="product-card__order">
                <button class="decrease-btn">-</button>
                <div class="product-card__order__quantity">0</div>
                <button class="increase-btn">+</button>
            </div>
            <div class="product-card__button">
                Add to cart
            </div>
        </div>
    `}
    `;

    return card;
}

function createProductCard(product) {
    const card = createCard(product, 'product');
    const decreaseBtn = card.querySelector('.decrease-btn');
    const increaseBtn = card.querySelector('.increase-btn');
    const quantityElem = card.querySelector('.quantity');
    const currentQuantityElem = card.querySelector('.product-card__order__quantity');
    const addToCartBtn = card.querySelector('.product-card__button');
    
    let currentQuantity = 0;
    const purchasedProduct = cart.find(item => item.id === product.id);
    let availableQuantity = product.quantity - (purchasedProduct?.buyQuantity || 0);

    function updateQuantity() {
        currentQuantityElem.textContent = currentQuantity;
        quantityElem.textContent = availableQuantity;
    }

    decreaseBtn.addEventListener('click', () => {
        if (currentQuantity > 0) {
            currentQuantity--;
            availableQuantity++;
            updateQuantity();
        }
    });

    increaseBtn.addEventListener('click', () => {
        if (availableQuantity > 0) {
            currentQuantity++;
            availableQuantity--;
            updateQuantity();
        }
    });

    addToCartBtn.addEventListener('click', () => {
        if (currentQuantity > 0) {
            addToCart(product, currentQuantity);
            currentQuantity = 0;
            updateQuantity();
        }
    });

    return card;
}

function createCartCard(product) {
    const card = createCard(product, 'cart');
    const decreaseBtn = card.querySelector('.decrease-btn');
    const increaseBtn = card.querySelector('.increase-btn');
    const quantityElem = card.querySelector('.cart-quantity');
    const deleteBtn = card.querySelector('.cart__list__elem__delete');

    function updateQuantity() {
        quantityElem.textContent = product.buyQuantity;
        updateDOM();
    }

    decreaseBtn.addEventListener('click', () => {
        if (product.buyQuantity > 1) {
            product.buyQuantity--;
            updateQuantity();
        } else {
            removeFromCart(product.id);
        }
    });

    increaseBtn.addEventListener('click', () => {
        const productInList = productsList.find(p => p.id === product.id);
        if (product.buyQuantity < productInList.quantity) {
            product.buyQuantity++;
            updateQuantity();
        }
    });

    deleteBtn.addEventListener('click', () => {
        removeFromCart(product.id);
    });

    return card;
}

function addToCart(product, quantity) {
    const index = findProductIndex(cart, product.id);
    
    if (index !== -1) {
        cart[index].buyQuantity += quantity;
    } else {
        cart.push({...product, buyQuantity: quantity});
    }
    
    updateDOM();
}

function removeFromCart(id) {
    const index = findProductIndex(cart, id);
    if (index !== -1) {
        cart.splice(index, 1);
        updateDOM();
    }
}

updateDOM();



