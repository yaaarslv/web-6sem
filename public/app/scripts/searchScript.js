document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        const searchButton = searchForm.querySelector(".search");
        searchButton.addEventListener('click', function (event) {
            event.preventDefault();
            const inputField = searchForm.querySelector('.input');
            const search_term = inputField.value.trim();
            if (search_term !== "") {
                window.location.href = `search-result?search-term=${search_term}`;
            } else {
                alert("Пожалуйста, введите запрос в поисковую строку.");
            }
        });
    }
});
