// Get references to HTML elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// Initialize search history array from localStorage
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// Display search history in the history page
function displaySearchHistory() {
  historyList.innerHTML = '';
  for (let i = searchHistory.length - 1; i >= 0; i--) {
    const li = document.createElement('li');
    li.textContent = searchHistory[i];
    li.addEventListener('click', function() {
      searchBooks(searchHistory[i]);
    });
    historyList.appendChild(li);
  }
}

// Save search query to localStorage and search history array
function saveSearchQuery(query) {
  searchHistory.push(query);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  displaySearchHistory();
}

// Clear search history from localStorage and array
function clearSearchHistory() {
  searchHistory = [];
  localStorage.removeItem('searchHistory');
  displaySearchHistory();
}

// Display book data in the search results
function displaySearchResults(data) {
  searchResults.innerHTML = '';
  for (let i = 0; i < data.items.length; i++) {
    const book = data.items[i].volumeInfo;
    const div = document.createElement('div');
    div.classList.add('book-card');
    div.innerHTML = `
      <div class="book-card-image">
        <img src="${book.imageLinks ? book.imageLinks.thumbnail : 'https://via.placeholder.com/128x192.png?text=No+Image'}">
      </div>
      <div class="book-card-details">
        <h2 class="book-title">${book.title}</h2>
        <p class="book-author">${book.authors ? book.authors.join(', ') : 'Unknown Author'}</p>
        <p class="book-description">${book.description ? book.description.substring(0, 200) + '...' : 'No description available.'}</p>
      </div>
    `;
    searchResults.appendChild(div);
  }
}

// Fetch book data from Google Books API and display it
function searchBooks(query) {
  fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
    .then(response => response.json())
    .then(data => {
      displaySearchResults(data);
      saveSearchQuery(query);
    })
    .catch(error => console.error(error));
}

// Event listeners
searchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const query = searchInput.value;
  if (query) {
    searchBooks(query);
  }
});

clearHistoryBtn.addEventListener('click', clearSearchHistory);

// Initialize app by displaying search history
displaySearchHistory();
