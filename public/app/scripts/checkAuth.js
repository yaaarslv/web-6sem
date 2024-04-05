document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('token');
    if (token) {
        const authButton = document.querySelector('.auth-button');
        authButton.textContent = 'Личный кабинет';

        const authForm = document.querySelector('.auth-form');
        authForm.action = 'profile'
    } else {
        if (window.location.href.includes('reviews')){
            const button = document.querySelector('.add-review-button');
            button.style.backgroundColor = "#ff001e"
        }
        // else if (window.location.href.includes('manage-users') ||
        //     window.location.href.includes('profile') || window.location.href.includes('subscription')  ||
        //     window.location.href.includes('add-news')  || window.location.href.includes('add-product') ||
        //     window.location.href.includes('manage-products') || window.location.href.includes('manage-news') ||
        //     window.location.href.includes('cart')) {
        //     window.location.href = `auth?redirect=${window.location.href.split("/").pop()}`;
        // }
    }
});