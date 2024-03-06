document.getElementById('sendRecoverCodeButton').addEventListener('click', function () {
    const email = document.getElementById('email').value;

    if (email) {
        const data = {
            recipient: email
        };

        const code_button = document.getElementById("sendRecoverCodeButton")
        code_button.disabled = true;

        fetch('https://beb-web.onrender.com/app/send_recover_code', {
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

document.getElementById('recoverForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const redirect = urlParams.get('redirect');

    const email = document.getElementById('email').value;
    const code = document.getElementById('code').value;

    const data = {
        email: email,
        code: code
    };

    const recoverForm = document.getElementById('recoverForm');
    recoverForm.classList.add('disabled');

    fetch('https://beb-web.onrender.com/app/check_recover_code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const recover_email = data.email
                const recoverForm = document.getElementById('recoverForm');
                const changePasswordForm = document.getElementById('changePasswordForm');
                recoverForm.style.display = 'none';
                changePasswordForm.style.display = 'block';
                document.getElementById('changePasswordForm').addEventListener('submit', function (e) {
                    e.preventDefault();

                    const password = document.getElementById('password').value;
                    const checkPassword = document.getElementById("checkPassword").value;
                    if (password === checkPassword) {
                        const data = {
                            email: recover_email,
                            password: password
                        };

                        const changePasswordForm = document.getElementById('changePasswordForm');
                        changePasswordForm.classList.add('disabled');

                        fetch('https://beb-web.onrender.com/user/change_password', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    alert(data.message)
                                    if (redirect){
                                        window.location.href = `${redirect}`;
                                    } else{
                                        window.location.href = "auth";
                                    }
                                } else {
                                    alert('Ошибка: ' + data.error);
                                    changePasswordForm.classList.remove('disabled');
                                }
                            })
                            .catch(error => {
                                console.error('Ошибка: ' + error);
                            });
                    } else {
                        alert("Пароли не совпадают!")
                    }
                });
            } else {
                alert('Ошибка подтверждения: ' + data.error);
                recoverForm.classList.remove('disabled');
            }
        })
        .catch(error => {
            console.error('Ошибка: ' + error);
        });
});

