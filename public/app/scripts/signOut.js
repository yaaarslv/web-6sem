document.addEventListener("DOMContentLoaded", function () {
    const signOutButton = document.querySelector('.sign-out-button');
    if (signOutButton) {
        signOutButton.addEventListener('click', function (event) {
            event.preventDefault();
            localStorage.clear();
            window.location.href = 'index';
        });
    }
});