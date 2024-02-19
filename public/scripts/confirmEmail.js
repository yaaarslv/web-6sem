const confirmEmailForm = document.querySelector('.confirmEmail-form');
const emailConfirmed = localStorage.getItem("emailConfirmed");
if (emailConfirmed === "false"){
    confirmEmailForm.style.display = "revert";
}

document.getElementById('sendCodeButton').addEventListener('click', function () {
    const email = localStorage.getItem("email");

    if (email) {
        const data = {
            recipient: email
        };

        const code_button = document.getElementById("sendCodeButton")
        code_button.disabled = true;

        fetch('https://petshop-backend-yaaarslv.vercel.app/send_code', {
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

document.getElementById('confirmEmailForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const redirect = urlParams.get('redirect');

    const email = localStorage.getItem("email");
    const code = document.getElementById('code').value;

    const data = {
        email: email,
        code: code
    };

    const confirmEmailForm = document.getElementById('confirmEmailForm');
    confirmEmailForm.classList.add('disabled');

    fetch('https://petshop-backend-yaaarslv.vercel.app/confirmEmail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Почта успешно подтверждена!")
                localStorage.setItem('emailConfirmed', data.emailConfirmed)
                if (redirect){
                    window.location.href = `${redirect}`;
                } else{
                    window.location.href = "index";
                }
            } else {
                alert('Ошибка регистрации: ' + data.error);
                confirmEmailForm.classList.remove('disabled');
            }
        })
        .catch(error => {
            console.error('Ошибка: ' + error);
        });
});