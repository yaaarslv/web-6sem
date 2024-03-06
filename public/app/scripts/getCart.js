async function fetchAndDisplayCart() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'auth?redirect=cart';
    }


    const loaders = document.querySelectorAll('.loader');
    const errorMessageBox = document.querySelector('.error-message');
    const cartList = document.querySelector('.cart-list');
    const cart_id = localStorage.getItem("cart_id")

    try {
        loaders.forEach(loader => {
            loader.style.display = 'block';
        })

        errorMessageBox.style.display = 'none';

        await new Promise(resolve => setTimeout(resolve, 2000));

        const data = {
            cart_id: cart_id
        };

        return fetch('https://beb-web.onrender.com/cart/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.products) {
                    data.products.forEach((product) => {
                        const productDiv = createProductElement(product);
                        const cartProductId = productDiv.querySelector(".cart-productId").textContent
                        const decreaseButton = productDiv.querySelector(".decrease-quantity")
                        const increaseButton = productDiv.querySelector(".increase-quantity")
                        const removeCartProductButton = productDiv.querySelector(".remove-cart-product-button")
                        decreaseButton.addEventListener('click', async function () {
                            let quantity = productDiv.querySelector(".cart-product-quantity");
                            if (quantity.textContent > 1) {
                                await new Promise(resolve => setTimeout(resolve, 200));
                                quantity.textContent--;
                                if (quantity.textContent == 1) {
                                    decreaseButton.style.backgroundColor = '#ff0000'
                                }
                                increaseButton.style.backgroundColor = '#007BFF'

                                const editData = {
                                    cartProductId: cartProductId,
                                    newQuantity: quantity.textContent
                                };

                                return fetch('https://beb-web.onrender.com/cart/changeQuantity', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(editData)
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        if (!data.success) {
                                            alert(data.error)
                                            quantity.textContent++;
                                            decreaseButton.style.backgroundColor = '#007BFF'
                                        }
                                    });
                            }
                        });

                        increaseButton.addEventListener('click', async function () {
                            let quantity = productDiv.querySelector(".cart-product-quantity");
                            let count = parseInt(productDiv.querySelector('.cart-product-countDiv').textContent);
                            if (quantity.textContent < count) {
                                await new Promise(resolve => setTimeout(resolve, 200));
                                quantity.textContent++;
                                if (quantity.textContent == count) {
                                    increaseButton.style.backgroundColor = '#ff0000'
                                }

                                if (quantity.textContent > 1) {
                                    decreaseButton.style.backgroundColor = '#007BFF'
                                }
                                const editData = {
                                    cartProductId: cartProductId,
                                    newQuantity: quantity.textContent
                                };

                                return fetch('https://beb-web.onrender.com/cart/changeQuantity', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(editData)
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        if (!data.success) {
                                            alert(data.error)
                                            quantity.textContent--;
                                            increaseButton.style.backgroundColor = '#007BFF'
                                            if (quantity.textContent == 1) {
                                                decreaseButton.style.backgroundColor = '#ff0000'
                                            }

                                        }
                                    });
                            }
                        });

                        removeCartProductButton.addEventListener('click', async function () {
                            productDiv.style.display = 'none'
                            const removeData = {
                                cartProductId: cartProductId,
                            };

                            return fetch('https://beb-web.onrender.com/cart/deleteCartProduct', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(removeData)
                            })
                                .then(response => response.json())
                                .then(data => {
                                    if (!data.success) {
                                        alert(data.error)
                                        productDiv.style.display = 'revert'
                                    }
                                });
                        });
                        cartList.appendChild(productDiv);
                    });
                }
            });

    } catch (error) {
        console.error(error);
        errorMessageBox.style.display = 'block';
    } finally {
        loaders.forEach(loader => {
            loader.style.display = 'none';
        })
    }
}

function createProductElement(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'cart-product';

    const productIdDiv = document.createElement('div');
    productIdDiv.className = 'cart-productId';
    productIdDiv.textContent = product.id;
    productIdDiv.style.display = "none";

    const productSelect = document.createElement('input');
    productSelect.type = "checkbox"
    productSelect.style.width = '40px';
    productSelect.style.height = '40px';

    const imageDiv = document.createElement('div');
    imageDiv.innerHTML = `<img class="cart-product-image" src="${product.imageurl}" alt="Product Image">`;
    imageDiv.addEventListener('mouseover', () => {
        imageDiv.style.cursor = "pointer";
    });

    const infoDiv = document.createElement('div');
    infoDiv.className = 'cart-product-info';

    const nameDiv = document.createElement('div');
    nameDiv.innerHTML = `<h3 class="cart-product-name">${product.name}</h3>`;
    nameDiv.addEventListener('mouseover', () => {
        nameDiv.style.transition = 'color 0.3s';
        nameDiv.style.cursor = "pointer";
        nameDiv.style.color = 'blue';
    });
    nameDiv.addEventListener('mouseout', () => {
        nameDiv.style.color = 'initial';
    });

    const quantityDiv = document.createElement('div');
    quantityDiv.className = 'cart-product-quantity';
    quantityDiv.textContent = product.quantity;

    const countDiv = document.createElement('div');
    countDiv.className = 'cart-product-countDiv';
    countDiv.textContent = product.count;
    countDiv.style.display = 'none';

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'cart-product-controls';

    const decreaseButton = document.createElement('button');
    decreaseButton.textContent = '-';
    decreaseButton.className = 'decrease-quantity';
    if (quantityDiv.textContent == 1) {
        decreaseButton.style.backgroundColor = '#ff0000'
    }
    controlsDiv.appendChild(decreaseButton);

    controlsDiv.appendChild(quantityDiv);

    const increaseButton = document.createElement('button');
    increaseButton.textContent = '+';
    increaseButton.className = 'increase-quantity';
    if (quantityDiv.textContent === countDiv.textContent) {
        increaseButton.style.backgroundColor = '#ff0000'
    }
    controlsDiv.appendChild(increaseButton);

    const basketButton = document.createElement('button');
    basketButton.className = 'remove-cart-product-button';
    basketButton.textContent = '❌';
    controlsDiv.appendChild(basketButton);

    const elements = [nameDiv, imageDiv];

    elements.forEach((element) => {
        element.addEventListener('click', () => {
            const productId = product.productid;
            window.open(`product?id=${productId}`);
        });
    });

    infoDiv.appendChild(controlsDiv);

    productDiv.appendChild(productSelect);
    productDiv.appendChild(imageDiv);
    productDiv.appendChild(productIdDiv);
    productDiv.appendChild(nameDiv);
    productDiv.appendChild(countDiv);
    productDiv.appendChild(infoDiv);

    return productDiv;
}

window.addEventListener('DOMContentLoaded', fetchAndDisplayCart);
