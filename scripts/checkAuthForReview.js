document.querySelector('.add-review-button').addEventListener('click', function () {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = "add-review.html"
    } else {
        alert("Чтобы отправить отзыв, войдите в аккаунт!")
        window.location.href = 'auth.html?redirect=reviews.html';
    }
});
