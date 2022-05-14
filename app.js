/*--------------
 MODAL VARIABLES
---------------*/
const cartBtn = document.querySelector(".cart-icon");
const cartModal = document.querySelector(".cart-modal");
const overlay = document.querySelector(".overlay");
const closeModal = document.querySelector("#confirm-btn");

//__I didn't add addToCartBtns here because they will load when products will show up (when refreshing)... 

/*------
products
-------*/
import { productsData } from './products.js'; //products data

const productsDom = document.querySelector('.products');//products container

//cart Variables...
let cart = [];

// 1. Get products
class Products {
    //~ OR GETTING FROM API
    getproducts() {
        return productsData;
    }
}
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
                    <button class="add-to-cart" data-id =${item.id}><i class="fas fa-shopping-cart"></i> Add to cart</button>
                </div>
            </div>
        </section>`;
            productsDom.innerHTML = result;
        })
    }

    //addToCart buttons...
    addToCartbuttons() {
        const addToCartBtns = document.querySelectorAll('.add-to-cart');
        const buttons = [...addToCartBtns];
        buttons.forEach(btn => {
            const id = btn.dataset.id;
            console.log(id);
            //check if the product is in cart or not...
            const isInCart = cart.find(product => product.id === id);
            console.log(cart);
            if (isInCart) {
                console.log("ridam");
                btn.innerHTML = '<i class="fa-solid fa-check"></i> In Cart'; //change btn text...
                btn.disabled = true; // to prevent user from clicking the button
            }
            //if isn't in cart...
            btn.addEventListener("click", event => {
                event.currentTarget.innerHTML = '<i class="fa-solid fa-check"></i> In Cart'; //with currentTarget the target will be the actual eventlistener so if you click on icon still refers to the button ... //![BUGFIX]
                event.currentTarget.disabled = true;
                //1.get product from productsData
                const addedProduct = Storage.getProduct(id); // get Product with that id
                console.log(addedProduct);
                //2.add product to cart
                cart = [...cart, { ...addedProduct, quantity: 1 }];
                //3.save added products in cart with local storage

                Storage.saveCart(cart);
            });

        });

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
}

document.addEventListener('DOMContentLoaded', () => {
    const products = new Products();
    const productsData = products.getproducts();
    const ui = new UI();
    ui.displayProducts(productsData);//Display products on DOM
    ui.addToCartbuttons();
    Storage.saveProducts(productsData);
})

/*-------------
MODAL FUNCTIONS
--------------*/
function showModal() {
    overlay.style.display = "block";
    cartModal.style.opacity = 1;
    cartModal.style.transform = "translateY(0em)";
    cartModal.style.transition = "all .5s";
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

