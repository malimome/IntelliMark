const form = document.querySelector('form');

form.addEventListener('submit', event => {
  event.preventDefault();

  // Get search query
  const searchTerm = document.querySelector('input[type="search"]').value;

  // Call search function
  console.log(searchTerm);

});