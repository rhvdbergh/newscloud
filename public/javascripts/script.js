// redirects to route with search term
$('#search-form').on('submit', (event) => {
    const searchTerm = $('#search-term').val().toLowerCase().trim();
    window.location.href = `/${searchTerm}`;
    event.preventDefault();
});

// redirects navbar button to /about/info page or to random word
const $btn = $('#nav-btn');

$btn.on('click', (event) => {
    if ($btn.text() === 'About') {
        window.location.href = '/about/info';
    } else {
        window.location.href = '/random/search';
    }
    event.preventDefault();
});