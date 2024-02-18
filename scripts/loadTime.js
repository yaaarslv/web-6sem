(function () {
    var startTime = performance.now();

    window.addEventListener('load', function () {
        var endTime = performance.now();
        var loadTime = endTime - startTime;

        const loadTimeDiv = document.createElement('div');
        loadTimeDiv.className = 'load-time';
        loadTimeDiv.innerHTML = 'Страница загружена за <span class="load-time-text">' + (loadTime / 1000).toFixed(4) + '</span> секунд';

        document.body.appendChild(loadTimeDiv);
    });
})();
