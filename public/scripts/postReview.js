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
    window.location.href = 'auth';
}

const isBanned = localStorage.getItem('isBanned');
if (isBanned === "true") {
    window.location.href = '403';
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

    fetch('https://beb-web.onrender.com/reviews', {
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
                window.location.href = 'reviews';
            } else {
                alert('Ошибка: ' + data.error);
                reviewForm.classList.remove('disabled');
            }
        })
        .catch(error => {
            console.error('Ошибка: ' + error);
        });
});
