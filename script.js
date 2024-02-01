const data = {
    'Fruits': ['Apples', 'Bananas', 'Oranges'],
    'Vegetables': ['Tomatoes', 'Cucumbers', 'Carrots'],
    'Berries': ['Strawberry', 'Grapes', 'Cherry'],
    'Drinks': ['Coffee', 'Tea', 'Juice'],
};

const prices = {
    'Apples': 10,
    'Bananas': 15,
    'Oranges': 12,
    'Tomatoes': 8,
    'Cucumbers': 6,
    'Carrots': 4,
    'Strawberry': 2,
    'Grapes': 16,
    'Cherry': 10,
    'Coffee': 20,
    'Tea': 5,
    'Juice': 7
}

const leftSidebar = document.getElementById('left-sidebar');
const categoriesSection = document.getElementById('categories-section');
const categoryList = document.getElementsByClassName('category');
const productList = document.getElementById('product-list');
const productDetails = document.getElementById('product-details');
const buyButton = document.getElementById('buy-button');
const productsSection = document.getElementById('products-section');
const productInfo = document.getElementById('product-info');
const orderForm = document.getElementById('order-form');
const ordersButton = document.getElementById('orders-button');
const shoppingCart = document.getElementById('shopping-cart-section');
const ordersList = document.getElementById("orders-list");
const orderInfo = document.getElementById("order-info");
const shoppingCartBtn =document.getElementById("shopping-cart-btn");
const removeOrderBtn = document.querySelector(".remove-btn");
let selectedProduct;

function showProducts(category) {
    const products = data[category];

    products.forEach((product, index) => {
        const listItem = document.createElement("li");
        listItem.className = "products-list-item";
        listItem.innerText = product;
        listItem.setAttribute('product-item-index', index);
        productList.appendChild(listItem);
    });
}

function removeProductList() {
    const lists = document.querySelectorAll(".products-list-item");
    if(lists.length > 0) lists.forEach((e) => e.remove());
}

Array.from(categoryList).forEach((element) => {
    element.addEventListener('click', (event) => {
        const category = event.target.textContent;
        removeProductList()
        showProducts(category);
        productsSection.style.display = "block";
        productInfo.style.display = "none";
    })
})

productList.addEventListener('click', (event) => {
    const product = event.target.textContent;
    productDetails.textContent = "You choose: " + product.toLowerCase();
    orderForm.style.display = "none";
    productInfo.style.display = "block";
    orderForm.reset();
    selectedProduct = product;
})

buyButton.addEventListener('click', () => {
    orderForm.style.display = "block";
})

function fillingForm() {
    const fullName = document.getElementById('full-name').value;
    const city = document.getElementById('city').value;
    const deliveryBranch = document.getElementById('delivery-branch').value;
    const cashOnDelivery = document.getElementById('cash-on-delivery');
    const cardPayment = document.getElementById('card-payment');
    const quantity = document.getElementById('quantity').value;
    const comments = document.getElementById('comment').value;
    const price = prices[selectedProduct] * quantity;
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    let selectedPaymentMethod;

    if (cashOnDelivery.checked) {
        selectedPaymentMethod = cashOnDelivery.value;
    }

    if (cardPayment.checked) {
        selectedPaymentMethod = cardPayment.value;
    }

    const order = {
        product: selectedProduct.toLowerCase(),
        price: price,
        orderTime: new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kiev' }),
        city: city,
        deliveryBranch: deliveryBranch,
        cardPayment: selectedPaymentMethod,
        quantity: quantity,
        comment: comments,
        fullName: fullName,
        id: orders.length + 1
    }

    return order;
}

orderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (orderForm.checkValidity()) {
        const order = fillingForm();
        saveOrder(order);

        alert(`You choose: ${order.product}: ${order.quantity} number of products. \n City: ${order.city}. \n System of payment: ${order.cardPayment} \n Branch delivery: ${order.deliveryBranch}.\n Thank you for your order!`);

        orderForm.reset();
        productDetails.innerText = '';
        productInfo.style.display = 'none';
        productsSection.style.display = 'none';
        orderForm.style.display = 'none';
    }
})

function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

function getOrders() {
    return JSON.parse(localStorage.getItem('orders')) || [];
}

ordersButton.addEventListener('click', () => {
    categoriesSection.style.display = 'none';
    shoppingCart.style.display = "block";
    productInfo.style.display = "none";
    productsSection.style.display = "none";
    productDetails.style.display = "none";
    ordersList.style.display = "block";

    showUserOrders();
    shoppingCartBtn.addEventListener("click", () => goBack());
})

function goBack() {
    const ordersLists = document.querySelectorAll(".orders-list-item");
    categoriesSection.style.display = 'block';
    shoppingCart.style.display = "none";
    ordersList.style.display = "none";
    orderInfo.style.display = "none";
    removeOrderBtn.style.display = "none";
    if(ordersLists.length > 0) ordersLists.forEach((e)=> e.remove());
}

function showUserOrders() {
    const storedObjects = getOrders();
    storedObjects.forEach(orders => {
        const listItem = document.createElement('li');
        listItem.className = 'orders-list-item';
        listItem.setAttribute('order-number', orders.id);
        listItem.innerHTML = `
           <span>${orders.product.toUpperCase()}</span>
           <span>Price: ${orders.price} UAN</span>
           <p>Date: ${orders.orderTime}</p>
        `;
        ordersList.appendChild(listItem);
    })
}

function showOrdersDetails(item) {
    const storedObjects = getOrders();
    let a;
    storedObjects.forEach((el) => {
        if (item == el.id) a = el;
    })
    return a;
}

function getLi(event) {
    const getLi = event.target.tagName != "LI" ? event.target.closest("li") : event.target;
    const orderNumber = getLi.getAttribute('order-number');
    const orderDetails = showOrdersDetails(orderNumber);
    return orderDetails;
}

function deleteOrder(li) {
    const allLi = document.querySelectorAll(".orders-list-item");
    const local = getOrders();
    const data = local.filter((e) => e.id != li.id);

    allLi.forEach((e) => {
        if(e.getAttribute('order-number') == li.id) e.remove();
    })

    localStorage.removeItem("orders");

    localStorage.setItem('orders', JSON.stringify(data));

    orderInfo.style.display = "none";
    removeOrderBtn.style.display = "none";
}

function createOrderInfo(li) {
    orderInfo.innerHTML = `
        <p>${li.product.toUpperCase()}</p>
        <p>Name: ${li.fullName}</p>
        <p>Pay method: ${li.cardPayment}</p>
        <p>Price: ${li.price} UAN</p>
        <p>Date: ${li.orderTime}</p>
        <p>Delivery: ${li.deliveryBranch}</p>
        <p>City: ${li.city}</p>
        <p>Quantity: ${li.deliveryBranch}</p>
        <p>Comments: ${li.comment}</p>
    `
    removeOrderBtn.addEventListener("click", () => deleteOrder(li));
}

ordersList.addEventListener("click", (event) => {
    const li = getLi(event);
    createOrderInfo(li);
    orderInfo.style.display = "block";
    removeOrderBtn.style.display = "block";
})