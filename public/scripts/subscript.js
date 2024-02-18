document.getElementById('subscriptionForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const emailConfirmed = localStorage.getItem("emailConfirmed");
    if (emailConfirmed === "false"){
        alert("Для подписки на уведомления подтвердите почту в личном кабинете!")
        window.location.href = "profile.html?redirect=subscription.html"
    } else {
        const email = localStorage.getItem("email");
        const data = {
            email: email,
        };

        const subscriptionForm = document.getElementById('subscriptionForm');
        subscriptionForm.classList.add('disabled');

        fetch('https://petshop-backend-yaaarslv.vercel.app/subscript', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Подписка оформлена!")
                    window.location.href = 'index.html';
                } else {
                    alert('Ошибка: ' + data.error);
                    subscriptionForm.classList.remove('disabled');
                }
            })
            .catch(error => {
                console.error('Ошибка: ' + error);
            });
    }
});
