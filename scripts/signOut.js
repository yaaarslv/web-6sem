document.addEventListener("DOMContentLoaded", function () {
    const signOutButton = document.querySelector('.sign-out-button');
    if (signOutButton) {
        signOutButton.addEventListener('click', function (event) {
            event.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('role')
            localStorage.removeItem('isBanned')
            localStorage.removeItem('email')
            localStorage.removeItem('emailConfirmed')
            localStorage.removeItem('cart_id')
            window.location.href = 'index.html';
        });
    }
});