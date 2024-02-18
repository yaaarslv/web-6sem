async function fetchAndDisplayNews() {
    const loader = document.querySelector('.loader');
    const errorMessageBox = document.querySelector('.error-message');

    try {
        loader.style.display = 'block';
        errorMessageBox.style.display = 'none';

        await new Promise(resolve => setTimeout(resolve, 2000));

        const response = await fetch('https://petshop-backend-yaaarslv.vercel.app/news');
        if (!response.ok) {
            throw new Error(`Ошибка при загрузке данных: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        const newsList = document.getElementById('news-list');

        if (data.news) {
            data.news.forEach((news_) => {
                const newsDiv = document.createElement('div');
                newsDiv.className = 'news_';

                const subjectDiv = document.createElement('div');
                subjectDiv.innerHTML = `<b class="news_subject">${news_.subject}</b>`;

                const textDiv = document.createElement('div');
                textDiv.className = 'news-text';
                textDiv.textContent = news_.text;

                const dateDiv = document.createElement('div');
                dateDiv.innerHTML = `<b class="news_date">${news_.date}</b>`;

                newsDiv.appendChild(subjectDiv);
                newsDiv.appendChild(textDiv);
                newsDiv.appendChild(dateDiv);

                newsList.appendChild(newsDiv);
            });
        }
    } catch (error) {
        console.error(error);
        errorMessageBox.style.display = 'block';
    } finally {
        loader.style.display = 'none';
    }
}

window.addEventListener('DOMContentLoaded', fetchAndDisplayNews);
