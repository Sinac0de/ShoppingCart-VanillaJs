/*--------------
 MODAL VARIABLES
---------------*/
const cartBtn = document.querySelector(".cart-icon");
const cartModal = document.querySelector(".cart-modal");
const overlay = document.querySelector(".overlay");
const closeModal = document.querySelector("#confirm-btn");

/*------
products
-------*/
import { productsData } from './products.js'; //products data

const productsDom = document.querySelector('.products');//products container

// TODO 
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
                    <button class="add-to-cart" data-id =${item.id}>Add to cart</button>
                </div>
            </div>
        </section>`;
            productsDom.innerHTML = result;
        })
    }
}
// 3. storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const products = new Products();
    const productsData = products.getproducts();
    const ui = new UI();
    ui.displayProducts(productsData);//Display products on DOM
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

