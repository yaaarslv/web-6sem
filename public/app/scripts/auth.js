// document.getElementById('loginForm').addEventListener('submit', function (e) {
//     e.preventDefault();
//     const queryString = window.location.search;
//     const urlParams = new URLSearchParams(queryString);
//     const redirect = urlParams.get('redirect');
//
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     const data = {
//         email: email,
//         password: password
//     };
//
//     const loginForm = document.getElementById('loginForm');
//     loginForm.classList.add('disabled');
//
//     fetch('https://beb-web.onrender.com/user/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 localStorage.setItem('token', data.token);
//                 localStorage.setItem('role', data.role)
//                 localStorage.setItem('isBanned', data.is_banned)
//                 localStorage.setItem('email', email)
//                 localStorage.setItem('emailConfirmed', data.emailconfirmed)
//                 localStorage.setItem('cart_id', data.cart_id)
//                 if (redirect){
//                     window.location.href = `${redirect}`;
//                 } else{
//                     window.location.href = "index";
//                 }
//             } else {
//                 alert('Ошибка входа: ' + data.error);
//                 loginForm.classList.remove('disabled');
//             }
//         })
//         .catch(error => {
//             console.error('Ошибка: ' + error);
//         });
// });

document.addEventListener("DOMContentLoaded", function () {
    window.location.href = 'https://beb-web.onrender.com/auth/google/login';
});