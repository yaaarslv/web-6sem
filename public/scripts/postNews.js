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

const role = localStorage.getItem('role');
const isBanned = localStorage.getItem('isBanned');
if (role === "User" || isBanned === "true") {
    window.location.href = '403';
}

document.getElementById('newsForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const subject = document.getElementById('subject').value;
    const text = document.getElementById('news-text').value;
    const data = {
        subject: subject,
        text: text
    };

    if (!is_valid_input(subject) || !is_valid_input(text)) {
        alert('Ошибка: Ввод содержит недопустимые символы.');
        return;
    }

    const newsForm = document.getElementById('newsForm');
    newsForm.classList.add('disabled');

    fetch('https://beb-web.onrender.com/news/postNews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = 'news';
            } else {
                alert('Ошибка: ' + data.error);
                newsForm.classList.remove('disabled');
            }
        })
        .catch(error => {
            console.error('Ошибка: ' + error);
        });
});
