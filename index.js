const cartBtn = document.querySelector(".cart-icon");
const cartModal = document.querySelector(".cart-modal");
const overlay = document.querySelector(".overlay");
const closeModal = document.querySelector("#confirm-btn");

function showModal() {
    overlay.style.display = "block";
    cartModal.style.opacity = 1;
    cartModal.style.transform = "translateY(0em)";
    cartModal.style.transition = "all .5s";
}

function closeTheModal() {
    overlay.style.display = "none";
    cartModal.style.opacity = 0;
    cartModal.style.transform = "translateY(-20em)";
}


cartBtn.addEventListener("click", showModal);

overlay.addEventListener("click", closeTheModal);

closeModal.addEventListener("click", closeTheModal);

