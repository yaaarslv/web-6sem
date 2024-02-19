function is_valid_input(input) {
    const pattern = /^[ёA-Za-zА-Яа-я0-9\s,.!?()]+$/;
    if (!pattern.test(input)) {
        alert("Недопустимый символ: " + input.match(/[^ёA-Za-zА-Яа-я0-9\s,.!?()]/)[0]);
        return false;
    }
    return true;
}

async function changeName(productId) {
    const row = document.querySelector(`#product-${productId}`);
    const nameCell = row.querySelector('.name-cell');

    const actions = row.querySelector('.actions');
    actions.style.display = 'none';

    const newName = document.createElement('div');
    newName.className = 'new-name';

    const newNameText = document.createElement('label');
    newNameText.innerHTML = '<textarea class="productTable-input" type="text" id="newName" name="newName" maxlength="255" placeholder="Введите новое название" required>';

    const applyButton = document.createElement('button');
    applyButton.textContent = 'Применить';

    const cancelChangeNameButton = document.createElement('button');
    cancelChangeNameButton.textContent = 'Отмена';

    newName.appendChild(newNameText);
    newName.appendChild(applyButton);
    newName.appendChild(cancelChangeNameButton);

    row.appendChild(newName);

    cancelChangeNameButton.addEventListener('click', () => {
        newName.style.display = 'none'
        actions.style.display = 'revert';
        cancelChangeNameButton.style.display = "none"
    });

    applyButton.addEventListener('click', async () => {
        const selectedName = newName.querySelector('textarea[name="newName"]').value;
        if (!selectedName){
            alert("Ввод пустой!")
            return
        }

        if (!is_valid_input(selectedName)){
            alert('Ошибка: Ввод содержит недопустимые символы.');
            return
        }

        const formData = new FormData();
        formData.append("newName", selectedName);
        formData.append("productId", productId);
        formData.append("action", "change_name");

        await fetch(`https://petshop-backend-yaaarslv.vercel.app/products`, {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message)
                    nameCell.textContent = selectedName
                } else {
                    alert('Ошибка: ' + data.error);
                }
            }).catch(error => {
                console.error('Ошибка: ' + error);
            });

        row.removeChild(newName)
        actions.style.display = 'revert';
    });
}

async function changePrice(productId) {
    const row = document.querySelector(`#product-${productId}`);
    const priceCell = row.querySelector('.price-cell');

    const actions = row.querySelector('.actions');
    actions.style.display = 'none';

    const newPrice = document.createElement('div');
    newPrice.className = 'new-price';

    const newPriceText = document.createElement('label');
    newPriceText.innerHTML = '<input class="productTable-input" type="number" id="newPrice" step="0.01" min="0" name="newPrice" maxlength="255" placeholder="Введите новую цену" required>';

    const applyButton = document.createElement('button');
    applyButton.textContent = 'Применить';

    const cancelChangePriceButton = document.createElement('button');
    cancelChangePriceButton.textContent = 'Отмена';

    newPrice.appendChild(newPriceText);
    newPrice.appendChild(applyButton);
    newPrice.appendChild(cancelChangePriceButton);

    row.appendChild(newPrice);

    cancelChangePriceButton.addEventListener('click', () => {
        newPrice.style.display = 'none'
        actions.style.display = 'revert';
        cancelChangePriceButton.style.display = "none"
    });

    applyButton.addEventListener('click', async () => {
        const selectedPrice = newPrice.querySelector('input[name="newPrice"]').value;
        if (!selectedPrice){
            alert("Ввод пустой!")
            return
        }

        if (parseFloat(selectedPrice) < 0) {
            alert("Цена не может быть отрицательной");
            return;
        }

        const formData = new FormData();
        formData.append("newPrice", selectedPrice);
        formData.append("productId", productId);
        formData.append("action", "change_price");

        await fetch(`https://petshop-backend-yaaarslv.vercel.app/products`, {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message)
                    priceCell.textContent = selectedPrice
                } else {
                    alert('Ошибка: ' + data.error);
                }
            }).catch(error => {
                console.error('Ошибка: ' + error);
            });

        row.removeChild(newPrice)
        actions.style.display = 'revert';
    });
}

async function changeCategory(productId) {
    const row = document.querySelector(`#product-${productId}`);
    const categoryCell = row.querySelector('.category-cell');
    const category = categoryCell.textContent;

    const actions = row.querySelector('.actions');
    actions.style.display = 'none';

    const radios = document.createElement('div');
    radios.className = 'category-radios';

    const catRadio = document.createElement('label');
    catRadio.innerHTML = '<br><input type="radio" name="category" value="Для кошек" ' + (category === 'Для кошек' ? 'checked' : '') + '> Для кошек';

    const dogRadio = document.createElement('label');
    dogRadio.innerHTML = '<br><input type="radio" name="category" value="Для собак" ' + (category === 'Для собак' ? 'checked' : '') + '> Для собак';

    const parrotRadio = document.createElement('label');
    parrotRadio.innerHTML = '<br><input type="radio" name="category" value="Для попугаев" ' + (category === 'Для попугаев' ? 'checked' : '') + '> Для попугаев';

    const turtleRadio = document.createElement('label');
    turtleRadio.innerHTML = '<br><input type="radio" name="category" value="Для черепах" ' + (category === 'Для черепах' ? 'checked' : '') + '> Для черепах';

    const applyButton = document.createElement('button');
    applyButton.textContent = 'Применить';

    const cancelEditCategoryButton = document.createElement('button');
    cancelEditCategoryButton.textContent = 'Отмена';

    radios.appendChild(catRadio);
    radios.appendChild(dogRadio);
    radios.appendChild(parrotRadio);
    radios.appendChild(turtleRadio);
    radios.appendChild(applyButton);
    radios.appendChild(cancelEditCategoryButton);

    row.appendChild(radios);

    cancelEditCategoryButton.addEventListener('click', () => {
        radios.style.display = 'none'
        actions.style.display = 'revert';
        cancelEditCategoryButton.style.display = "none"
    });

    applyButton.addEventListener('click', async () => {
        const selectedCategory = radios.querySelector('input[name="category"]:checked').value;

        const formData = new FormData();
        formData.append("newCategory", selectedCategory);
        formData.append("productId", productId);
        formData.append("action", "change_category");

        await fetch(`https://petshop-backend-yaaarslv.vercel.app/products`, {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message)
                    categoryCell.textContent = selectedCategory
                } else {
                    alert('Ошибка: ' + data.error);
                }
            }).catch(error => {
                console.error('Ошибка: ' + error);
            });

        row.removeChild(radios)
        actions.style.display = 'revert';
    });
}

async function changeBrand(productId) {
    const row = document.querySelector(`#product-${productId}`);
    const brandCell = row.querySelector('.brand-cell');

    const actions = row.querySelector('.actions');
    actions.style.display = 'none';

    const newBrand = document.createElement('div');
    newBrand.className = 'new-brand';

    const newBrandText = document.createElement('label');
    newBrandText.innerHTML = '<textarea class="productTable-input" type="text" id="newBrand" name="newBrand" maxlength="255" placeholder="Введите новый бренд" required>';

    const applyButton = document.createElement('button');
    applyButton.textContent = 'Применить';

    const cancelChangeBrandButton = document.createElement('button');
    cancelChangeBrandButton.textContent = 'Отмена';

    newBrand.appendChild(newBrandText);
    newBrand.appendChild(applyButton);
    newBrand.appendChild(cancelChangeBrandButton);

    row.appendChild(newBrand);

    cancelChangeBrandButton.addEventListener('click', () => {
        newBrand.style.display = 'none'
        actions.style.display = 'revert';
        cancelChangeBrandButton.style.display = "none"
    });

    applyButton.addEventListener('click', async () => {
        const selectedBrand = newBrand.querySelector('textarea[name="newBrand"]').value;
        if (!selectedBrand){
            alert("Ввод пустой!")
            return
        }

        if (!is_valid_input(selectedBrand)){
            alert('Ошибка: Ввод содержит недопустимые символы.');
            return
        }

        const formData = new FormData();
        formData.append("newBrand", selectedBrand);
        formData.append("productId", productId);
        formData.append("action", "change_brand");

        await fetch(`https://petshop-backend-yaaarslv.vercel.app/products`, {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message)
                    brandCell.textContent = selectedBrand
                } else {
                    alert('Ошибка: ' + data.error);
                }
            }).catch(error => {
                console.error('Ошибка: ' + error);
            });

        row.removeChild(newBrand)
        actions.style.display = 'revert';
    });
}

async function changeCount(productId) {
    const row = document.querySelector(`#product-${productId}`);
    const countCell = row.querySelector('.count-cell');

    const actions = row.querySelector('.actions');
    actions.style.display = 'none';

    const newCount = document.createElement('div');
    newCount.className = 'new-count';

    const newCountText = document.createElement('label');
    newCountText.innerHTML = '<input class="productTable-input" type="number" id="newCount" step="1" min="0" name="newCount" maxlength="255" placeholder="Введите новое количество" required>';

    const applyButton = document.createElement('button');
    applyButton.textContent = 'Применить';

    const cancelChangeCountButton = document.createElement('button');
    cancelChangeCountButton.textContent = 'Отмена';

    newCount.appendChild(newCountText);
    newCount.appendChild(applyButton);
    newCount.appendChild(cancelChangeCountButton);

    row.appendChild(newCount);

    cancelChangeCountButton.addEventListener('click', () => {
        newCount.style.display = 'none'
        actions.style.display = 'revert';
        cancelChangeCountButton.style.display = "none"
    });

    applyButton.addEventListener('click', async () => {
        const selectedCount = newCount.querySelector('input[name="newCount"]').value;
        if (!selectedCount){
            alert("Ввод пустой!")
            return
        }

        if (parseFloat(selectedCount) < 0) {
            alert("Количество не может быть отрицательным");
            return;
        }

        if (selectedCount.includes('.') || selectedCount.includes(',')) {
            alert("Количество не может быть дробным");
            return;
        }

        const formData = new FormData();
        formData.append("newCount", selectedCount);
        formData.append("productId", productId);
        formData.append("action", "change_count");

        await fetch(`https://petshop-backend-yaaarslv.vercel.app/products`, {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message)
                    countCell.textContent = selectedCount
                } else {
                    alert('Ошибка: ' + data.error);
                }
            }).catch(error => {
                console.error('Ошибка: ' + error);
            });

        row.removeChild(newCount)
        actions.style.display = 'revert';
    });
}

async function changeImage(productId) {
    const row = document.querySelector(`#product-${productId}`);
    const imageCell = row.querySelector('.image-cell');

    const actions = row.querySelector('.actions');
    actions.style.display = 'none';

    const newImage = document.createElement('div');
    newImage.className = 'new-image';

    const newImageFile = document.createElement('label');
    newImageFile.innerHTML = '<input type="file" id="product-image" name="product-image" accept="image/*" required>'

    const applyButton = document.createElement('button');
    applyButton.textContent = 'Применить';

    const cancelChangeImageButton = document.createElement('button');
    cancelChangeImageButton.textContent = 'Отмена';

    newImage.appendChild(newImageFile);
    newImage.appendChild(applyButton);
    newImage.appendChild(cancelChangeImageButton);

    row.appendChild(newImage);

    cancelChangeImageButton.addEventListener('click', () => {
        newImage.style.display = 'none'
        actions.style.display = 'revert';
        cancelChangeImageButton.style.display = "none"
    });

    applyButton.addEventListener('click', async () => {
        const selectedImage = newImage.querySelector('input[name="product-image"]').files[0];
        if (!selectedImage){
            alert("Фотография не загружена!")
            return
        }

        let fileName = selectedImage.name;
        let fileExtension = fileName.split(".")[fileName.split(".").length - 1];

        const formData = new FormData();
        formData.append("imagefile", selectedImage);
        formData.append("productId", productId);
        formData.append("action", "change_image");

        await fetch(`https://petshop-backend-yaaarslv.vercel.app/products`, {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message)
                    imageCell.src = `https://petshop-backend-yaaarslv.vercel.app/images/${productId}.${fileExtension}`;
                } else {
                    alert('Ошибка: ' + data.error);
                }
            }).catch(error => {
                console.error('Ошибка: ' + error);
            });

        row.removeChild(newImage)
        actions.style.display = 'revert';
    });
}

async function deleteProduct(productId) {
    const row = document.querySelector(`#product-${productId}`);

    const actions = row.querySelector('.actions');
    actions.style.display = 'none';

    const radios = document.createElement('div');
    radios.className = 'delete-radios';

    const yesRadio = document.createElement('label');
    yesRadio.innerHTML = '<input type="radio" name="choice" value="Да"> Да';

    const noRadio = document.createElement('label');
    noRadio.innerHTML = '<input type="radio" name="choice" value="Нет" checked> Нет';

    const applyButton = document.createElement('button');
    applyButton.textContent = 'Применить';
    applyButton.classList.add('disabled');

    const cancelDeleteProductButton = document.createElement('button');
    cancelDeleteProductButton.textContent = 'Отмена';

    radios.appendChild(yesRadio);
    radios.appendChild(noRadio);
    radios.appendChild(applyButton);
    radios.appendChild(cancelDeleteProductButton);

    row.appendChild(radios);

    cancelDeleteProductButton.addEventListener('click', () => {
        radios.style.display = 'none'
        actions.style.display = 'revert';
        cancelDeleteProductButton.style.display = "none"
    });

    yesRadio.querySelector('input').addEventListener('change', () => {
        applyButton.classList.remove('disabled');
    });

    noRadio.querySelector('input').addEventListener('change', () => {
        applyButton.classList.add('disabled');
    });

    applyButton.addEventListener('click', async () => {
        const selectedChoice = radios.querySelector('input[name="choice"]:checked').value;
        if (selectedChoice === "Да") {
            const data = {
                productId: productId,
                action: "delete_product",
            };

            const formData = new FormData();
            formData.append("productId", productId);
            formData.append("action", "delete_product");

            await fetch(`https://petshop-backend-yaaarslv.vercel.app/products`, {
                method: 'POST',
                body: formData
            }).then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert(data.message)
                        row.style.display = 'none'
                    } else {
                        alert('Ошибка: ' + data.error);
                    }
                }).catch(error => {
                    console.error('Ошибка: ' + error);
                });

            row.removeChild(radios)
            actions.style.display = 'revert';
        }
    });
}

function toggleVisibility(productId) {
    const row = document.querySelector(`#product-${productId}`);
    const categoryCell = row.querySelector('.addedBy-cell');
    const showButton = categoryCell.querySelector('#showButton');
    const hideButton = categoryCell.querySelector('#hideButton');
    const content = categoryCell.querySelector('#addedByContent');


    if (content.style.display === "none") {
        content.style.display = "block";
        showButton.style.display = "none";
        hideButton.style.display = "block";
    } else {
        content.style.display = "none";
        showButton.style.display = "block";
        hideButton.style.display = "none";
    }
}


async function loadProductsData() {
    const token = localStorage.getItem('token');
    if (!token){
        window.location.href = 'auth';
    }

    const role = localStorage.getItem('role');
    const isBanned = localStorage.getItem('isBanned');
    if (role === "User" || isBanned === "true") {
        window.location.href = '403';
    }

    const loader = document.querySelector('.loader');

    try {
        loader.style.display = 'block';
        const response = await fetch('https://petshop-backend-yaaarslv.vercel.app/products');
        if (!response.ok) {
            throw new Error('Ошибка при загрузке данных');
        }

        const productsData = await response.json();
        const productsTableBody = document.getElementById('productsTableBody');

        productsTableBody.innerHTML = '';

        if (productsData.products) {
            productsData.products.forEach(product => {
                const row = document.createElement('tr');
                row.id = `product-${product.id}`;
                row.innerHTML = `
<!--                    <td class="productId-cell">${product.id}</td>-->
                    <td class="name-cell">${product.name}</td>
                    <td class="price-cell">${product.price}</td>
                    <td class="category-cell">${product.category}</td>
                    <td class="brand-cell">${product.brand}</td>
                    <td class="image-cell"><img class="tableImage" src="${product.imageURL}" alt="Product Image"></td>

                    <td class="count-cell">${product.count}</td>
                    <td class="addedBy-cell">
                    <div id="addedByContent" style="display: none;">${product.addedBy}</div>
                    <button id="showButton" onclick="toggleVisibility('${product.id}')" style="font-size: 10px">Показать</button>
                    <button id="hideButton" onclick="toggleVisibility('${product.id}')" style="display: none; font-size: 10px">Скрыть</button>
                    </td>
                    <td class="actions">
                        <button class="edit-name-button" onclick="changeName('${product.id}')">Изменить название</button>
                        <button class="edit-price-button" onclick="changePrice('${product.id}')">Изменить цену</button>
                        <button class="edit-category-button" onclick="changeCategory('${product.id}')">Изменить категорию</button>
                        <button class="edit-brand-button" onclick="changeBrand('${product.id}')">Изменить бренд</button>
                        <button class="edit-image-button" onclick="changeImage('${product.id}')">Изменить изображение</button>
                        <button class="edit-count-button" onclick="changeCount('${product.id}')">Изменить количество</button>
                        <button class="delete-button" onclick="deleteProduct('${product.id}')">Удалить</button>
                    </td>
                `;
                productsTableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error(error);
    } finally {
        loader.style.display = 'none';
    }
}

window.addEventListener('DOMContentLoaded', loadProductsData);
