document.querySelector('.add-review-button').addEventListener('click', function () {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = "add-review"
    } else {
        alert("Чтобы отправить отзыв, войдите в аккаунт!")
        window.location.href = 'auth?redirect=reviews';
    }
});
