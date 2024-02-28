document.addEventListener("DOMContentLoaded", function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const product_id = urlParams.get('id');

    const loader = document.querySelector('.loader');
    const errorMessageBox = document.querySelector('.error-message');
    const productContainer = document.querySelector('.product-container');

    try {
        loader.style.display = 'block';
        errorMessageBox.style.display = 'none';

        fetch('https://beb-web.onrender.com/product/' + product_id)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (data.product) {
                        const product = data.product
                        const productDiv = document.createElement('div');
                        productDiv.className = 'productPage';

                        const nameDiv = document.createElement('div');
                        nameDiv.innerHTML = `<h3 class="product-name">${product.name}</h3>`;

                        // const descriptionDiv = document.createElement('div');
                        // descriptionDiv.className = 'product-description';
                        // descriptionDiv.textContent = `Описание: ${product.description}`;

                        const imageDiv = document.createElement('div');
                        imageDiv.innerHTML = `<img class="product-image" src="${product.imageURL}" alt="Product Image">`;

                        const priceDiv = document.createElement('div');
                        priceDiv.className = 'product-price';
                        priceDiv.textContent = `Цена: ${product.price} руб`;

                        const categoryDiv = document.createElement('div');
                        categoryDiv.className = 'product-category';
                        categoryDiv.textContent = `Категория: ${product.category}`;

                        const brandDiv = document.createElement('div');
                        brandDiv.className = 'product-brand';
                        brandDiv.textContent = `Бренд: ${product.brand}`;

                        const availabilityDiv = document.createElement('div');
                        availabilityDiv.className = 'product-availability';
                        availabilityDiv.textContent = `В наличии: ${product.availability ? 'Да' : 'Нет'}`;

                        const ratingDiv = document.createElement('div');
                        ratingDiv.className = 'product-rating';
                        ratingDiv.textContent = `Рейтинг: ${product.rating}`;

                        productDiv.appendChild(imageDiv);
                        productDiv.appendChild(nameDiv);
                        // productDiv.appendChild(descriptionDiv);
                        productDiv.appendChild(priceDiv);
                        productDiv.appendChild(categoryDiv);
                        productDiv.appendChild(brandDiv);
                        productDiv.appendChild(availabilityDiv);
                        productDiv.appendChild(ratingDiv);

                        productContainer.appendChild(productDiv);
                    }
                } else {
                    alert('Ошибка: ' + data.error);
                }
            })
    } catch (error) {
        console.error(error);
        errorMessageBox.style.display = 'block';
    } finally {
        loader.style.display = 'none';
    }
});





