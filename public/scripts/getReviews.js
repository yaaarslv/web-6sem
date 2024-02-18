async function fetchAndDisplayReviews() {
    const loader = document.querySelector('.loader');
    const errorMessageBox = document.querySelector('.error-message');

    try {
        loader.style.display = 'block';
        errorMessageBox.style.display = 'none';

        await new Promise(resolve => setTimeout(resolve, 2000));

        const response = await fetch('https://petshop-backend-yaaarslv.vercel.app/reviews');
        if (!response.ok) {
            throw new Error(`Ошибка при загрузке данных: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        const reviewsList = document.getElementById('reviews-list');

        if (data.reviews) {
            data.reviews.forEach((review) => {
                const reviewDiv = document.createElement('div');
                reviewDiv.className = 'review';

                const authorDiv = document.createElement('div');
                authorDiv.innerHTML = `<b class="reviewer">${review.author}</b>`;

                const textDiv = document.createElement('div');
                textDiv.className = 'review-text';
                textDiv.textContent = review.text;

                reviewDiv.appendChild(authorDiv);
                reviewDiv.appendChild(textDiv);

                reviewsList.appendChild(reviewDiv);
            });
        }
    } catch (error) {
        console.error(error);
        errorMessageBox.style.display = 'block';
    } finally {
        loader.style.display = 'none';
    }
}

window.addEventListener('DOMContentLoaded', fetchAndDisplayReviews);
