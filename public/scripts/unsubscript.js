document.getElementById('unsubscriptionForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const emailConfirmed = localStorage.getItem("emailConfirmed");
    if (emailConfirmed === "false"){
        alert("Для отписки от уведомлений подтвердите почту в личном кабинете!")
        window.location.href = "profile?redirect=cancel-subscription"
    } else {
        const email = localStorage.getItem("email");
        const data = {
            email: email,
        };

        const unsubscriptionForm = document.getElementById('unsubscriptionForm');
        unsubscriptionForm.classList.add('disabled');

        fetch('https://petshop-backend-yaaarslv.vercel.app/unsubscript', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Подписка отменена!")
                    window.location.href = 'index';
                } else {
                    alert('Ошибка: ' + data.error);
                    unsubscriptionForm.classList.remove('disabled');
                }
            })
            .catch(error => {
                console.error('Ошибка: ' + error);
            });
    }
});
