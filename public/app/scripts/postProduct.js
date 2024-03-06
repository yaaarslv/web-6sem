function is_valid_input(input) {
    const pattern = /^[ёA-Za-zА-Яа-я0-9\s,.!?()]+$/;
    if (!pattern.test(input)) {
        alert("Недопустимый символ: " + input.match(/[^ёA-Za-zА-Яа-я0-9\s,.!?()]/)[0]);
        return false;
    }
    return true;
}

const token = localStorage.getItem('token');
if (!token){
    window.location.href = 'auth';
}

const role = localStorage.getItem('role');
const isBanned = localStorage.getItem('isBanned');
if (role === "User" || isBanned === "true") {
    window.location.href = '403';
}

document.getElementById('addProductForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const categoryInputs = document.getElementsByName('product-category');
    let category_;

    categoryInputs.forEach((input) => {
        if (input.checked) {
            category_ = input.value;
        }
    });

    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = document.getElementById('product-price').value;
    const category = category_;
    const brand = document.getElementById('product-brand').value;
    const rating = document.getElementById('product-rating').value;
    const count = document.getElementById('product-count').value;
    const imagefile = document.getElementById('product-image').files[0];
    const token = localStorage.getItem('token');

    if (!is_valid_input(name) ||
        !is_valid_input(description) ||
        !is_valid_input(price) ||
        !is_valid_input(category) ||
        !is_valid_input(brand) ||
        !is_valid_input(rating) ||
        !is_valid_input(count)) {
        alert('Ошибка: Ввод содержит недопустимые символы.');
        return;
    }

    const addProductForm = document.getElementById('addProductForm');
    addProductForm.classList.add('disabled');


    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("rating", rating);
    formData.append("count", count);
    formData.append("imagefile", imagefile);
    formData.append("token", token);

    fetch('https://petshop-backend-yaaarslv.vercel.app/addProduct', {
        method: 'POST',
        body: formData
    })

        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message)
                window.location.href = 'catalog';
            } else {
                alert('Ошибка: ' + data.error);
                addProductForm.classList.remove('disabled');
            }
        })
        .catch(error => {
            console.error('Ошибка: ' + error);
        });
});
