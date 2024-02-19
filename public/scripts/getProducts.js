const allBrands = new Set();

async function fetchAndDisplayProducts() {
    const cart_id = localStorage.getItem("cart_id")
    const loaders = document.querySelectorAll('.loader');
    const errorMessageBox = document.querySelector('.error-message');
    const productList = document.querySelector('.product-list');

    try {
        loaders.forEach(loader => {
            loader.style.display = 'block';
        })

        errorMessageBox.style.display = 'none';

        await new Promise(resolve => setTimeout(resolve, 2000));

        if (!cart_id) {
            const response = await fetch('https://petshop-backend-yaaarslv.vercel.app/products');
            if (!response.ok) {
                throw new Error(`Ошибка при загрузке данных: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            if (data.products) {
                data.products.forEach((product) => {
                    const productDiv = document.createElement('div');
                    productDiv.className = 'product';

                    const nameDiv = document.createElement('div');
                    nameDiv.innerHTML = `<h3 class="product-name">${product.name}</h3>`;
                    nameDiv.addEventListener('mouseover', () => {
                        nameDiv.style.transition = 'color 0.3s';
                        nameDiv.style.cursor = "pointer";
                        nameDiv.style.color = 'blue';
                    });
                    nameDiv.addEventListener('mouseout', () => {
                        nameDiv.style.color = 'initial';
                    });


                    const imageDiv = document.createElement('div');
                    imageDiv.innerHTML = `<img class="product-image" src="${product.imageURL}" alt="Product Image">`;
                    imageDiv.addEventListener('mouseover', () => {
                        imageDiv.style.cursor = "pointer";
                    });

                    const priceDiv = document.createElement('div');
                    priceDiv.className = 'product-price';
                    priceDiv.textContent = `Цена: ${product.price} руб.`;

                    const categoryDiv = document.createElement('div');
                    categoryDiv.className = 'product-category';
                    categoryDiv.textContent = product.category;
                    categoryDiv.style.display = 'none';

                    const brandDiv = document.createElement('div');
                    brandDiv.className = 'product-brand';
                    brandDiv.textContent = product.brand;
                    brandDiv.style.display = 'none';

                    const availabilityDiv = document.createElement('div');
                    availabilityDiv.className = 'product-availability';
                    availabilityDiv.textContent = `${product.availability ? 'В наличии' : 'Нет в наличии'}`;
                    availabilityDiv.style.display = `${product.availability ? 'none' : 'initial'}`;

                    const countDiv = document.createElement('div');
                    countDiv.className = 'product-countDiv';
                    countDiv.textContent = `${product.count === 1 ? "Последний товар!" : `Осталось: ${product.count}`}`;
                    countDiv.style.display = `${product.count === 0 ? 'none' : 'initial'}`;

                    const cartItemIdDiv = document.createElement('div');
                    cartItemIdDiv.className = 'product-cart_item_id';
                    cartItemIdDiv.textContent = 'None';
                    cartItemIdDiv.style.display = "none"

                    const quantityDiv = document.createElement('div');
                    quantityDiv.className = 'product-quantity';
                    quantityDiv.textContent = 'None';
                    quantityDiv.style.display = "none"

                    const addToCartButton = document.createElement('button');
                    addToCartButton.className = 'add-to-cart-button';
                    addToCartButton.textContent = 'В корзину';
                    addToCartButton.style.fontSize = '25px';
                    addToCartButton.style.display = `${product.quantity ? "none" : 'initial'}`;

                    if (product.count === 0){
                        addToCartButton.classList.add('disabled');
                    }

                    addToCartButton.addEventListener('click', async function () {
                        alert("Чтобы добавить товар в корзину, нужно авторизоваться!")
                        window.location.href = 'auth?redirect=catalog'
                    });

                    productDiv.appendChild(imageDiv);
                    productDiv.appendChild(nameDiv);
                    productDiv.appendChild(priceDiv);
                    productDiv.appendChild(categoryDiv);
                    productDiv.appendChild(brandDiv);
                    productDiv.appendChild(availabilityDiv);
                    productDiv.appendChild(countDiv);
                    productDiv.appendChild(cartItemIdDiv);
                    productDiv.appendChild(quantityDiv);
                    productDiv.appendChild(addToCartButton);
                    productList.appendChild(productDiv);

                    const elements = [nameDiv, imageDiv];

                    elements.forEach((element) => {
                        element.addEventListener('click', () => {
                            const productId = product.id;
                            window.open(`product?id=${productId}`);
                        });
                    });

                    const brandName = brandDiv.textContent;
                    allBrands.add(brandName);
                });

                const brandFilter = document.getElementById('brand-filter');

                allBrands.forEach(brandName => {
                    const input = document.createElement('input');
                    input.type = 'checkbox';
                    input.id = `brand-${brandName}`;
                    input.value = brandName;

                    const label = document.createElement('label');
                    labelFor = `brand-${brandName}`;
                    label.textContent = brandName;

                    brandFilter.appendChild(input);
                    brandFilter.appendChild(label);

                    const lineBreak = document.createElement('br');
                    brandFilter.appendChild(lineBreak);
                });
            }
        } else {
            const formData = new FormData();
            formData.append("cart_id", cart_id);

            fetch('https://petshop-backend-yaaarslv.vercel.app/products', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.products) {
                        data.products.forEach((product) => {
                            const productDiv = document.createElement('div');
                            productDiv.className = 'product';

                            const nameDiv = document.createElement('div');
                            nameDiv.innerHTML = `<h3 class="product-name">${product.name}</h3>`;
                            nameDiv.addEventListener('mouseover', () => {
                                nameDiv.style.transition = 'color 0.3s';
                                nameDiv.style.cursor = "pointer";
                                nameDiv.style.color = 'blue';
                            });
                            nameDiv.addEventListener('mouseout', () => {
                                nameDiv.style.color = 'initial';
                            });

                            const imageDiv = document.createElement('div');
                            imageDiv.innerHTML = `<img class="product-image" src="${product.imageURL}" alt="Product Image">`;
                            imageDiv.addEventListener('mouseover', () => {
                                imageDiv.style.cursor = "pointer";
                            });

                            const priceDiv = document.createElement('div');
                            priceDiv.className = 'product-price';
                            priceDiv.textContent = `Цена: ${product.price} руб.`;

                            const categoryDiv = document.createElement('div');
                            categoryDiv.className = 'product-category';
                            categoryDiv.textContent = product.category;
                            categoryDiv.style.display = 'none';

                            const brandDiv = document.createElement('div');
                            brandDiv.className = 'product-brand';
                            brandDiv.textContent = product.brand;
                            brandDiv.style.display = 'none';

                            const availabilityDiv = document.createElement('div');
                            availabilityDiv.className = 'product-availability';
                            availabilityDiv.textContent = `${product.availability ? 'В наличии' : 'Нет в наличии'}`;
                            availabilityDiv.style.display = `${product.availability ? 'none' : 'initial'}`;

                            const countDiv = document.createElement('div');
                            countDiv.className = 'product-countDiv';
                            countDiv.textContent = `${product.count === 1 ? "Последний товар!" : `Осталось: ${product.count}`}`;
                            countDiv.style.display = `${product.count === 0 ? 'none' : 'initial'}`;

                            const cartItemIdDiv = document.createElement('div');
                            cartItemIdDiv.className = 'product-cart_item_id';
                            cartItemIdDiv.textContent = `${product.cart_item_id ? product.cart_item_id : 'None'}`;
                            cartItemIdDiv.style.display = "none"

                            const quantityDiv = document.createElement('div');
                            quantityDiv.className = 'product-quantity';
                            quantityDiv.textContent = `${product.quantity ? product.quantity : 'None'}`;
                            quantityDiv.style.display = `${product.quantity ? "initial" : 'none'}`;

                            const controlsDiv = document.createElement('div');
                            controlsDiv.className = 'cart-product-controls';
                            controlsDiv.style.display = `${product.quantity ? "initial" : 'none'}`;

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

                            const addToCartButton = document.createElement('button');
                            addToCartButton.className = 'add-to-cart-button';
                            addToCartButton.textContent = 'В корзину';
                            addToCartButton.style.fontSize = '25px';
                            addToCartButton.style.display = `${product.quantity ? "none" : 'initial'}`;

                            if (product.count === 0){
                                addToCartButton.classList.add('disabled');
                            }

                            decreaseButton.addEventListener('click', async function () {
                                let quantity = quantityDiv;
                                if (quantity.textContent > 1) {
                                    await new Promise(resolve => setTimeout(resolve, 200));
                                    quantity.textContent--;
                                    if (quantity.textContent == 1) {
                                        decreaseButton.style.backgroundColor = '#ff0000'
                                    }
                                    increaseButton.style.backgroundColor = '#007BFF'

                                    const editData = {
                                        cartProductId: cartItemIdDiv.textContent,
                                        newQuantity: quantity.textContent
                                    };

                                    return fetch('https://petshop-backend-yaaarslv.vercel.app/changeQuantity', {
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
                                let quantity = quantityDiv;
                                let count = parseInt(product.count);
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
                                        cartProductId: cartItemIdDiv.textContent,
                                        newQuantity: quantity.textContent
                                    };

                                    return fetch('https://petshop-backend-yaaarslv.vercel.app/changeQuantity', {
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

                            basketButton.addEventListener('click', async function () {
                                const removeData = {
                                    cartProductId: cartItemIdDiv.textContent,
                                };

                                return fetch('https://petshop-backend-yaaarslv.vercel.app/deleteCartProduct', {
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
                                        } else {
                                            controlsDiv.style.display = 'none';
                                            addToCartButton.style.display = 'initial';
                                        }
                                    });
                            });

                            addToCartButton.addEventListener('click', async function () {
                                const editData = {
                                    productId: product.id,
                                    cart_id: cart_id
                                };

                                return fetch('https://petshop-backend-yaaarslv.vercel.app/addProductToCart', {
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
                                        } else {
                                            const cart_item_id = data.cart_item_id;
                                            let count = parseInt(product.count);
                                            quantityDiv.textContent = "1";
                                            quantityDiv.style.display = "initial";
                                            decreaseButton.style.backgroundColor = '#ff0000'
                                            if (quantityDiv.textContent == count) {
                                                increaseButton.style.backgroundColor = '#ff0000'
                                            }
                                            cartItemIdDiv.textContent = cart_item_id;
                                            addToCartButton.style.display = 'none';
                                            controlsDiv.style.display = 'initial'
                                        }
                                    });
                            });

                            productDiv.appendChild(imageDiv);
                            productDiv.appendChild(nameDiv);
                            productDiv.appendChild(priceDiv);
                            productDiv.appendChild(categoryDiv);
                            productDiv.appendChild(brandDiv);
                            productDiv.appendChild(availabilityDiv);
                            productDiv.appendChild(countDiv);
                            productDiv.appendChild(cartItemIdDiv);
                            // productDiv.appendChild(quantityDiv);
                            productDiv.appendChild(controlsDiv);
                            productDiv.appendChild(addToCartButton);
                            productList.appendChild(productDiv);

                            const elements = [nameDiv, imageDiv];

                            elements.forEach((element) => {
                                element.addEventListener('click', () => {
                                    const productId = product.id;
                                    window.open(`product?id=${productId}`);
                                });
                            });

                            const brandName = brandDiv.textContent;
                            allBrands.add(brandName);
                        });

                        const brandFilter = document.getElementById('brand-filter');

                        allBrands.forEach(brandName => {
                            const input = document.createElement('input');
                            input.type = 'checkbox';
                            input.id = `brand-${brandName}`;
                            input.value = brandName;

                            const label = document.createElement('label');
                            labelFor = `brand-${brandName}`;
                            label.textContent = brandName;

                            brandFilter.appendChild(input);
                            brandFilter.appendChild(label);

                            const lineBreak = document.createElement('br');
                            brandFilter.appendChild(lineBreak);
                        });
                    }
                });
        }
    } catch (error) {
        console.error(error);
        errorMessageBox.style.display = 'block';
    } finally {
        loaders.forEach(loader => {
            loader.style.display = 'none';
        })
    }
}

window.addEventListener('DOMContentLoaded', fetchAndDisplayProducts);

document.addEventListener("DOMContentLoaded", function () {
    const filterButton = document.querySelector('.applyFilters')
    filterButton.addEventListener('click', function () {
        const selectedCategories = [];
        if (document.getElementById('filter-cat').checked) {
            selectedCategories.push('Для кошек');
        }
        if (document.getElementById('filter-dog').checked) {
            selectedCategories.push('Для собак');
        }
        if (document.getElementById('filter-parrot').checked) {
            selectedCategories.push('Для попугаев');
        }
        if (document.getElementById('filter-turtle').checked) {
            selectedCategories.push('Для черепах');
        }

        const brandFilter = document.getElementById('brand-filter');
        const selectedBrands = Array.from(brandFilter.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
        const minPrice = parseInt(document.getElementById('minPrice').value, 10);
        const maxPrice = parseInt(document.getElementById('maxPrice').value, 10);

        const selectedAvailabilities = [];
        if (document.getElementById('in-stock').checked) {
            selectedAvailabilities.push('В наличии');
        }
        if (document.getElementById('out-of-stock').checked) {
            selectedAvailabilities.push('Нет в наличии');
        }

        const products = document.querySelectorAll('.product');
        products.forEach(product => {
            product.style.display = 'none';
        });

        products.forEach(product => {

            const categoryName = product.querySelector('.product-category').textContent;
            const brandName = product.querySelector('.product-brand').textContent;
            const price = parseInt(product.querySelector('.product-price').textContent.split(' ')[1], 10);
            const availability = product.querySelector('.product-availability').textContent;

            if (
                (selectedCategories.length === 0 || selectedCategories.includes(categoryName)) &&
                (selectedAvailabilities.length === 0 || selectedAvailabilities.includes(availability)) &&
                (!minPrice || price >= minPrice) &&
                (!maxPrice || price <= maxPrice) &&
                (selectedBrands.length === 0 || selectedBrands.includes(brandName))
            ) {
                product.style.display = 'flex';
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const resetFiltersButton = document.querySelector('.resetFiltersButton');

    resetFiltersButton.addEventListener('click', function () {
        document.getElementById('filter-cat').checked = false;
        document.getElementById('filter-dog').checked = false;
        document.getElementById('filter-parrot').checked = false;
        document.getElementById('filter-turtle').checked = false;

        document.getElementById('in-stock').checked = false;
        document.getElementById('out-of-stock').checked = false;


        document.getElementById('minPrice').value = '';
        document.getElementById('maxPrice').value = '';
        document.getElementById('brand-filter').querySelectorAll('input[type="checkbox"]:checked').forEach(function (checkbox) {
            checkbox.checked = false;
        });

        const products = document.querySelectorAll('.product');
        products.forEach(product => {
            product.style.display = 'flex';
        });
    });
});


