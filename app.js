const cartBtn = document.querySelector(".cart-icon");
const cartModal = document.querySelector(".cart-modal");
const overlay = document.querySelector(".overlay");
const closeModal = document.querySelector("#confirm-btn");
const productsDom = document.querySelector('.products');//products container
const cartItems = document.querySelector(".cart-count"); //number of products in cart
const cartTotalPrice = document.querySelector('.total-price');
const cartContent = document.querySelector(".cart-content"); //items section of cart modal
const clearCart = document.querySelector("#clear-btn");
//__I didn't add addToCartBtns here because they will load when products will show up (when refreshing)... 

import { productsData } from './products.js'; //products data

let cart = [];//cart Items will be stored in this array
// 1. Get products
class Products {
    //~ OR GETTING FROM API
    getproducts() {
        return productsData;
    }
}

let buttonsDOM = [];//addToCart buttons will be stored in this array

// 2. Display products on DOM
class UI {
    displayProducts(productsData) {
        let result = "";
        productsData.forEach(item => {
            result += `<section class="product">
            <div class="product-img">
                <img src=${item.imageUrl} alt=${item.imageAlt}>
            </div>
            <div class="product-info">
                <div class="product-title-rate">
                    <p class="product-title">${item.title}</p>
                    <span>4.5 <i class="fa-solid fa-star"></i></span>
                </div>
                <div class="product-price-cart">
                    <p class="product-price">$${item.price}</p>
                    <button class="add-to-cart addToCart-hover" data-id =${item.id}><i class="fas fa-shopping-cart"></i> Add to cart</button>
                </div>
            </div>
        </section>`;
            productsDom.innerHTML = result;
        })
    }
    //addToCart buttons...
    getAddToCartbuttons() {
        const addToCartBtns = [...document.querySelectorAll('.add-to-cart')];
        buttonsDOM = addToCartBtns;

        addToCartBtns.forEach(btn => {
            const id = btn.dataset.id;
            //check if the product is in cart or not...
            const isInCart = cart.find(product => product.id === id);
            if (isInCart) {
                btn.innerHTML = '<i class="fa-solid fa-check"></i> In Cart'; //change btn text...
                btn.disabled = true; // to prevent user from clicking the button
                btn.classList.remove('addToCart-hover');
                btn.style.color = "var(--main-black)";
                btn.target.title = "Already in the cart!";
            }
            //if isn't in cart...
            btn.addEventListener("click", event => {
                event.currentTarget.innerHTML = '<i class="fa-solid fa-check"></i> In Cart';
                event.currentTarget.disabled = true;
                event.currentTarget.classList.remove('addToCart-hover');
                event.currentTarget.title = "Already in the cart!";
                //1.get product from productsData
                const addedProduct = { ...Storage.getProduct(id), quantity: 1 }; // get Product with that id
                //2.add product to cart
                cart = [...cart, addedProduct];
                //3.save added products in cart with local storage
                Storage.saveCart(cart);
                //Update cart value
                this.setCartValue(cart);
                //add cart item to DOM
                this.addCartItem(addedProduct);
            });

        });

    }
    //Cart total price
    setCartValue(cart) {
        let tempItems = 0; // number of items in the cart
        //Cart total price
        const totalPrice = cart.reduce((acc, curr) => {
            tempItems += curr.quantity;
            return acc + curr.quantity * curr.price;
        }, 0);
        cartItems.innerText = tempItems; //change number of in cart items on DOM
        cartTotalPrice.innerText = `Total price : ${totalPrice.toFixed(2)}$`;//Update the Cart total price
    }
    //add items to cart and show on DOM
    addCartItem(addedProduct) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `<div class="cart-item-img">
            <img src=${addedProduct.imageUrl} alt=${addedProduct.imageAlt}>
        </div>
        <div class="cart-item-info">
            <p class="cart-item-title">${addedProduct.title}</p>
            <p class="cart-item-price">$${addedProduct.price}</p>
        </div>
        <div class="cart-item-count">
            <i class="fa-solid fa-angle-up increment-cart" data-id = ${addedProduct.id}></i>
            <p>${addedProduct.quantity}</p>
            <i class="fa-solid fa-angle-down decrement-cart" data-id = ${addedProduct.id}></i>
        </div>
        <i class="fa-solid fa-trash-can cart-remove-item" data-id = ${addedProduct.id}></i>`;
        cartContent.appendChild(div);
    }

    setupApp() {
        //get cart from storage
        cart = Storage.getCart() || []; //change the global variable (cart)
        //for each items in cart call addCartItem
        cart.forEach(cartItem => this.addCartItem(cartItem));
        //setvalues : price + items count
        this.setCartValue(cart);
    }

    cartLogic() {
        //clear cart items
        clearCart.addEventListener("click", () => this.clearCart());
        //cart functionality
        cartContent.addEventListener("click", (event) => {
            if (event.target.classList.contains('increment-cart')) {
                const incrementBtn = event.target;
                //1. get item from cart
                const addedItem = cart.find(cartItem => cartItem.id === parseInt(incrementBtn.dataset.id));
                addedItem.quantity++;
                //2. update cart value
                this.setCartValue(cart);
                //3. save cart
                Storage.saveCart(cart);
                //4. Update cart item in UI
                incrementBtn.nextElementSibling.innerText = addedItem.quantity;
            }
        });

    }

    //clear cart content and values completely
    clearCart() {
        //remove total price
        cart.forEach(cartItem => this.removeItem(cartItem.id));
        //remove cart content children
        while (cartContent.children.length) {
            cartContent.removeChild(cartContent.children[0]);
        }
        closeTheModal();
    }

    //remove items in cart and update storage
    removeItem(id) {
        //Update cart
        cart = cart.filter(cItem => cItem.id !== id);
        //total price and cart items
        this.setCartValue(cart);
        //Update Storage:
        Storage.saveCart(cart);
        //get addtocart btns and change text and disabled
        this.resetAddToCartBtn(id);
    }

    //reset add to cart button to default values and styles
    resetAddToCartBtn(id) {
        const button = buttonsDOM.find(btn => parseInt(btn.dataset.id) === parseInt(id));
        button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to cart';
        button.disabled = false;
        button.classList.add('addToCart-hover');
        button.title = "";
    }


}
// 3. storage
class Storage {
    static saveProducts(products) {//save all products on DOM
        localStorage.setItem("products", JSON.stringify(products));
    }

    static getProduct(id) {//get the product with an specific id from local storage
        const _products = JSON.parse(localStorage.getItem("products"));
        return _products.find(p => p.id === parseInt(id));
    }

    static saveCart(cart) {//save added products to cart in the local storage
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    static getCart(cart) {
        return JSON.parse(localStorage.getItem("cart"));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const products = new Products();
    const productsData = products.getproducts();
    //get cart and setup app
    const ui = new UI();
    ui.setupApp();
    ui.cartLogic();
    // ui.getAddToCartbuttons();
    ui.displayProducts(productsData);//Display products on DOM
    // ui.getAddToCartbuttons();
    Storage.saveProducts(productsData);
    ui.getAddToCartbuttons();
})

/*-------------
MODAL FUNCTIONS
--------------*/
function showModal() {
    //check if there's any product in cart
    if (cartItems.innerHTML === "0") {
        alert("Cart shoma khali ast!")
    } else {
        overlay.style.display = "block";
        cartModal.style.opacity = 1;
        cartModal.style.transform = "translateY(0em)";
        cartModal.style.transition = "all .5s";
    }
}

function closeTheModal() {
    overlay.style.display = "none";
    cartModal.style.opacity = 0;
    cartModal.style.transform = "translateY(-60em)";
}
/*------------------
MODAL EventListeners
-------------------*/
cartBtn.addEventListener("click", showModal);
overlay.addEventListener("click", closeTheModal);
closeModal.addEventListener("click", closeTheModal);

