function is_valid_input(input) {
    const pattern = /^[ёA-Za-zА-Яа-я0-9\s,.!?()]+$/;
    if (!pattern.test(input)) {
        alert("Недопустимый символ: " + input.match(/[^ёA-Za-zА-Яа-я0-9\s,.!?()]/)[0]);
        return false;
    }
    return true;
}

const token = localStorage.getItem('token');
if (!token){
    window.location.href = 'auth.html';
}

const isBanned = localStorage.getItem('isBanned');
if (isBanned === "true") {
    window.location.href = '403.html';
}

document.getElementById('reviewForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const author = document.getElementById('author').value;
    const text = document.getElementById('review-text').value;
    const data = {
        author: author,
        text: text
    };

    if (!is_valid_input(author) || !is_valid_input(text)) {
        alert('Ошибка: Ввод содержит недопустимые символы.');
        return;
    }

    const reviewForm = document.getElementById('reviewForm');
    reviewForm.classList.add('disabled');

    fetch('https://petshop-backend-yaaarslv.vercel.app/reviews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Отзыв отправлен!")
                window.location.href = 'reviews.html';
            } else {
                alert('Ошибка: ' + data.error);
                reviewForm.classList.remove('disabled');
            }
        })
        .catch(error => {
            console.error('Ошибка: ' + error);
        });
});
