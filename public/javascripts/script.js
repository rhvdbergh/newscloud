// redirects to route with search term
$('#search-form').on('submit', (event) => {
    const searchTerm = $('#search-term').val();
    window.location.href = `/${searchTerm}`;
    event.preventDefault();
});