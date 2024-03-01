(function () {
    var startTime = performance.now();

    window.addEventListener('load', function () {
        var endTime = performance.now();
        var loadTime = (endTime - startTime) / 1000;

        new Promise(resolve => setTimeout(resolve, 3000)).then(r => {
            fetch('https://beb-web.onrender.com/loadingTime')
                .then(response => response.json())
                .then(data => {
                    var serverProcessingTime = data / 1000;
                    const loadTimeDiv = document.createElement('div');
                    loadTimeDiv.className = 'load-time';
                    loadTimeDiv.innerHTML = 'Страница загружена за <span class="load-time-text">' + loadTime.toFixed(4) + '</span>секунд (клиент)' + ' + <span class="load-time-text">' + serverProcessingTime.toFixed(4) + '</span>секунд (сервер)';

                    document.body.appendChild(loadTimeDiv);
                });
        });
    });
})();
