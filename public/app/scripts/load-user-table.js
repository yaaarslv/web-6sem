document.addEventListener("DOMContentLoaded", function () {
    const days = localStorage.getItem("days-count")
    const count = localStorage.getItem("max-lessons-count")

    if (days && count) {
        const loadingArea = document.querySelector(".loading-area");
        loadingArea.style.display = "block"

        const loadArea = document.createElement("div")
        loadArea.className = "load-area"
        loadArea.textContent = "В памяти сохранены предыдущие параметры. Загрузить их?"

        const loadButton = document.createElement("b")
        loadButton.innerHTML = `<button class="load-button" type="submit">Загрузить</button>`

        const notLoadButton = document.createElement("b")
        notLoadButton.innerHTML = `<button class="not-load-button" type="submit">Не загружать</button>`

        loadArea.appendChild(loadButton)
        loadArea.appendChild(notLoadButton)
        loadingArea.appendChild(loadArea)

        loadButton.addEventListener("click", function (e) {
            e.preventDefault()
            printUserTable(days, count)

            loadingArea.removeChild(loadArea)
            loadingArea.style.display = "none"
        });

        notLoadButton.addEventListener("click", function (e) {
            e.preventDefault()
            loadingArea.removeChild(loadArea)
            loadingArea.style.display = "none"
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('lab5-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const daysInput = document.getElementsByName('days_count');

        let days;

        daysInput.forEach((input) => {
            if (input.checked) {
                days = input.value;
            }
        });




        const maxLessonsCount = document.getElementById('max-lessons-count');
        const count = maxLessonsCount.value;

        if (count !== "") {
            printUserTable(days, count)

            const savingArea = document.querySelector('.saving-area')
            savingArea.style.display = "block"

            const saveAreas = document.querySelectorAll(".save-area")
            if (saveAreas) {
                saveAreas.forEach(area => {
                    savingArea.removeChild(area)
                })
            }

            const saveArea = document.createElement("div")
            saveArea.className = "save-area"
            saveArea.textContent = "Сохранить введённые параметры?"

            const saveButton = document.createElement("b")
            saveButton.innerHTML = `<button class="save-button" type="submit">Сохранить</button>`

            const notSaveButton = document.createElement("b")
            notSaveButton.innerHTML = `<button class="not-save-button" type="submit">Не сохранять</button>`

            saveArea.appendChild(saveButton)
            saveArea.appendChild(notSaveButton)
            savingArea.appendChild(saveArea)

            saveButton.addEventListener("click", function (e) {
                e.preventDefault()

                localStorage.setItem("days-count", days)
                localStorage.setItem("max-lessons-count", count)
                alert("Параметры сохранены!")
                savingArea.removeChild(saveArea)
                savingArea.style.display = "none"
            });

            notSaveButton.addEventListener("click", function (e) {
                e.preventDefault()
                savingArea.removeChild(saveArea)
                savingArea.style.display = "none"
            });
        } else {
            alert("Пожалуйста, введите количество дней");
        }
    });
});

function printUserTable(days, count) {
    const userTable = document.getElementById('table');
    userTable.innerHTML = '';

    const table = document.createElement('table');
    table.classList.add('user-table');

    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    tr.innerHTML = `<th>№ занятия</th>
                        <th>Понедельник</th>
                        <th>Вторник</th>
                        <th>Среда</th>
                        <th>Четверг</th>
                        <th>Пятница</th>`

    if (days === 'six_days') {
        tr.innerHTML += `<th>Суббота</th>`;
    }

    thead.appendChild(tr);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    for (let i = 0; i < count; i++) {

        const row = document.createElement('tr');
        row.id = `lesson-${i}`;
        row.innerHTML = `
    <td class="lesson-number">${i + 1}</td>
    <td class="monday"><textarea name="monday-${i}"></textarea></td>
    <td class="tuesday"><textarea name="tuesday-${i}"></textarea></td>
    <td class="wednesday"><textarea name="wednesday-${i}"></textarea></td>
    <td class="thursday"><textarea name="thursday-${i}"></textarea></td>
    <td class="friday"><textarea name="friday-${i}"></textarea></td>`;


        if (days === 'six_days') {
            row.innerHTML += `<td class="saturday"><textarea type="text" name="saturday-${i}"></textarea></td>`;
        }

        tbody.appendChild(row);
    }

    table.appendChild(tbody)
    userTable.appendChild(table)
}