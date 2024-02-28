async function getRoleFromServer() {
    const token = localStorage.getItem("token");
    if (token) {
        const data = {
            token: token
        };

        return fetch('https://beb-web.onrender.com/checkRoleIsBanned', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const role = data.role;
                    const isBanned = data.isBanned;
                    const emailConfirmed = data.emailConfirmed;
                    const cart_id = data.cart_id;
                    localStorage.setItem('role', role);
                    localStorage.setItem('isBanned', isBanned);
                    localStorage.setItem('emailConfirmed', emailConfirmed);
                    localStorage.setItem('cart_id', cart_id);
                }
            });
    }
}

getRoleFromServer().then(_ => {
    const token = localStorage.getItem('token');
    if (token) {
        const role = localStorage.getItem('role')
        const isBanned = localStorage.getItem('isBanned')
        if (window.location.href.includes('add-news')) {
            if (role === "User" || isBanned === "true") {
                window.location.href = '403';
            }
        } else if (window.location.href.includes('manage-news')) {
            if (role === "User" || isBanned === "true") {
                window.location.href = '403';
            }
        } else if (window.location.href.includes('news')) {
            if (role === "Admin" || role === "Superadmin") {
                const newsForm = document.querySelector('.addNews');
                const newsButton = document.createElement('button');
                newsButton.className = 'add-news-button';
                newsButton.textContent = "Добавить новость";

                const manageNewsForm = document.querySelector('.manageNewsForm');
                const manageNewsFormButton = document.createElement('button');
                manageNewsFormButton.className = 'manage-news-button';
                manageNewsFormButton.textContent = "Управлять новостями";

                newsForm.appendChild(newsButton);
                manageNewsForm.appendChild(manageNewsFormButton);
            }
        } else if (window.location.href.includes('catalog')) {
            if (role === "Admin" || role === "Superadmin") {
                const productsForm = document.querySelector('.addProduct');
                const productButton = document.createElement('button');
                productButton.className = 'add-product-button';
                productButton.textContent = "Добавить товар";

                const manageProductsForm = document.querySelector('.manageProductsForm');
                const manageProductsButton = document.createElement('button');
                manageProductsButton.className = 'manage-products-button';
                manageProductsButton.textContent = "Управлять товарами";

                productsForm.appendChild(productButton);
                manageProductsForm.appendChild(manageProductsButton);
            }
        } else if (window.location.href.includes('profile')) {
            if (role === "Superadmin") {
                const manageRoles = document.getElementById('manageRoles');
                const manageRolesButton = document.createElement('button');
                manageRolesButton.className = 'manage-roles-button';
                manageRolesButton.textContent = "Управление пользователями";
                manageRoles.appendChild(manageRolesButton);
            }
        } else if (window.location.href.includes('manage-users')) {
            if (role === "User" || role === "Admin" || isBanned === "true") {
                window.location.href = '403';
            }
        } else if (window.location.href.includes('subscription') || window.location.href.includes('add-review')) {
            if (isBanned === "true") {
                window.location.href = '403';
            }
        } else if (window.location.href.includes('reviews')) {
            if (isBanned === "true") {
                const button = document.querySelector('.add-review-button');
                button.style.backgroundColor = "#67000b"
            }
        } else if (window.location.href.includes('add-product')) {
            if (role === "User" || isBanned === "true") {
                window.location.href = '403';
            }
        }  else if (window.location.href.includes('manage-products')) {
            if (role === "User" || isBanned === "true") {
                window.location.href = '403';
            }
        }
    }
});
