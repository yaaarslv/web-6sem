function is_valid_input(input) {
    const pattern = /^[ёA-Za-zА-Яа-я0-9\s,.!?()]+$/;
    if (!pattern.test(input)) {
        alert("Недопустимый символ: " + input.match(/[^ёA-Za-zА-Яа-я0-9\s,.!?()]/)[0]);
        return false;
    }
    return true;
}

async function changeSubject(newsId) {
    const row = document.querySelector(`#news_-${newsId}`);
    const subjectCell = row.querySelector('.subject-cell');

    const actions = row.querySelector('.actions');
    actions.style.display = 'none';

    const newSubject = document.createElement('div');
    newSubject.className = 'new-subject';

    const newSubjectText = document.createElement('label');
    newSubjectText.innerHTML = '<textarea class="newsTable-input" type="text" id="newSubject" name="newSubject" maxlength="255" placeholder="Введите новый заголовок" required>';

    const applyButton = document.createElement('button');
    applyButton.textContent = 'Применить';

    const cancelChangeSubjectButton = document.createElement('button');
    cancelChangeSubjectButton.textContent = 'Отмена';

    newSubject.appendChild(newSubjectText);
    newSubject.appendChild(applyButton);
    newSubject.appendChild(cancelChangeSubjectButton);

    row.appendChild(newSubject);

    cancelChangeSubjectButton.addEventListener('click', () => {
        newSubject.style.display = 'none'
        actions.style.display = 'revert';
        cancelChangeSubjectButton.style.display = "none"
    });

    applyButton.addEventListener('click', async () => {
        const selectedSubject = newSubject.querySelector('textarea[name="newSubject"]').value;
        if (!selectedSubject){
            alert("Ввод пустой!")
            return
        }

        if (!is_valid_input(selectedSubject)){
            alert('Ошибка: Ввод содержит недопустимые символы.');
            return
        }

        const data = {
            newsId: newsId,
            action: "change_subject",
            newSubject: selectedSubject
        };

        await fetch(`https://petshop-backend-yaaarslv.vercel.app/news`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message)
                    subjectCell.textContent = selectedSubject
                } else {
                    alert('Ошибка: ' + data.error);
                }
            }).catch(error => {
                console.error('Ошибка: ' + error);
            });

        row.removeChild(newSubject)
        actions.style.display = 'revert';
    });
}

async function changeText(newsId) {
    const row = document.querySelector(`#news_-${newsId}`);
    const textCell = row.querySelector('.text-cell');

    const actions = row.querySelector('.actions');
    actions.style.display = 'none';

    const newText = document.createElement('div');
    newText.className = 'new-text';

    const newTextText = document.createElement('label');
    newTextText.innerHTML = '<textarea class="newsTable-input" type="text" id="newText" name="newText" maxlength="255" placeholder="Введите новый текст" required>';

    const applyButton = document.createElement('button');
    applyButton.textContent = 'Применить';

    const cancelChangeTextButton = document.createElement('button');
    cancelChangeTextButton.textContent = 'Отмена';

    newText.appendChild(newTextText);
    newText.appendChild(applyButton);
    newText.appendChild(cancelChangeTextButton);

    row.appendChild(newText);

    cancelChangeTextButton.addEventListener('click', () => {
        newText.style.display = 'none'
        actions.style.display = 'revert';
        cancelChangeTextButton.style.display = "none"
    });

    applyButton.addEventListener('click', async () => {
        const selectedText = newText.querySelector('textarea[name="newText"]').value;
        if (!selectedText){
            alert("Ввод пустой!")
            return
        }

        if (!is_valid_input(selectedText)){
            alert('Ошибка: Ввод содержит недопустимые символы.');
            return
        }

        const data = {
            newsId: newsId,
            action: "change_text",
            newText: selectedText
        };

        await fetch(`https://petshop-backend-yaaarslv.vercel.app/news`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message)
                    textCell.textContent = selectedText
                } else {
                    alert('Ошибка: ' + data.error);
                }
            }).catch(error => {
                console.error('Ошибка: ' + error);
            });

        row.removeChild(newText)
        actions.style.display = 'revert';
    });
}

async function deleteNews(newsId) {
    const row = document.querySelector(`#news_-${newsId}`);

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

    const cancelDeleteNewsButton = document.createElement('button');
    cancelDeleteNewsButton.textContent = 'Отмена';

    radios.appendChild(yesRadio);
    radios.appendChild(noRadio);
    radios.appendChild(applyButton);
    radios.appendChild(cancelDeleteNewsButton);

    row.appendChild(radios);

    cancelDeleteNewsButton.addEventListener('click', () => {
        radios.style.display = 'none'
        actions.style.display = 'revert';
        cancelDeleteNewsButton.style.display = "none"
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
                newsId: newsId,
                action: "delete_news",
            };

            await fetch(`https://petshop-backend-yaaarslv.vercel.app/news`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
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

async function loadNewsData() {
    const token = localStorage.getItem('token');
    if (!token){
        window.location.href = 'auth.html';
    }

    const role = localStorage.getItem('role');
    const isBanned = localStorage.getItem('isBanned');
    if (role === "User" || isBanned === "true") {
        window.location.href = '403.html';
    }

    const loader = document.querySelector('.loader');

    try {
        loader.style.display = 'block';
        const response = await fetch('https://petshop-backend-yaaarslv.vercel.app/news');
        if (!response.ok) {
            throw new Error('Ошибка при загрузке данных');
        }

        const newsData = await response.json();
        const newsTableBody = document.getElementById('newsTableBody');

        newsTableBody.innerHTML = '';

        if (newsData.news) {
            newsData.news.forEach(news_ => {
                const row = document.createElement('tr');
                row.id = `news_-${news_.id}`;
                row.innerHTML = `
<!--                    <td class="productId-cell">${news_.id}</td>-->
                    <td class="subject-cell">${news_.subject}</td>
                    <td class="text-cell">${news_.text}</td>
                    <td class="date-cell">${news_.date}</td>
                    
                    <td class="actions">
                        <button class="edit-subject-button" onclick="changeSubject('${news_.id}')">Изменить заголовок</button>
                        <button class="edit-text-button" onclick="changeText('${news_.id}')">Изменить текст</button>
                        <button class="delete-button" onclick="deleteNews('${news_.id}')">Удалить</button>
                    </td>
                `;
                newsTableBody.appendChild(row);
            });
        }
    } catch (error) {
        console.error(error);
    } finally {
        loader.style.display = 'none';
    }
}

window.addEventListener('DOMContentLoaded', loadNewsData);
