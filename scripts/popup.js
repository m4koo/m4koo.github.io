let targetUrl = '';

function openPopup(url) {
    targetUrl = url;
    document.getElementById('popup').classList.remove('hidden');
}

function closePopup() {
    document.getElementById('popup').classList.add('hidden');
}

function confirmRedirect() {
    window.open(targetUrl, '_blank');
    closePopup();
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('popup').addEventListener('click', function(e) {
        if (e.target === this) closePopup();
    });
});