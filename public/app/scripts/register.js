document.getElementById('sendCodeButton').addEventListener('click', function () {
    const email = document.getElementById('email').value;

    if (email) {
        const data = {
            recipient: email
        };

        const code_button = document.getElementById("sendCodeButton")
        code_button.disabled = true;

        fetch('https://beb-web.onrender.com/app/send_code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Код подтверждения успешно отправлен на указанный адрес почты');
                } else {
                    alert('Ошибка при отправке кода подтверждения: ' + data.error);
                    code_button.disabled = false;
                }
            })
            .catch(error => {
                console.error('Ошибка: ' + error);
            });
    } else {
        alert('Введите почту, чтобы отправить код подтверждения');
    }
});

document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const code = document.getElementById('code').value;

    const data = {
        email: email,
        password: password,
        code: code
    };

    const registerForm = document.getElementById('registerForm');
    registerForm.classList.add('disabled');

    fetch('https://beb-web.onrender.com/user/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role)
                localStorage.setItem('isBanned', data.is_banned)
                localStorage.setItem('email', email)
                localStorage.setItem('emailConfirmed', data.emailconfirmed)
                localStorage.setItem('cart_id', data.cart_id)
                window.location.href = 'index';
            } else {
                alert('Ошибка регистрации: ' + data.error);
                registerForm.classList.remove('disabled');
            }
        })
        .catch(error => {
            console.error('Ошибка: ' + error);
        });
});