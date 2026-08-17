// BookNest catalogue application

const books = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "Fiction",
    available: true
  },
  {
    id: 2,
    title: "Tomorrow, and Tomorrow, and Tomorrow",
    author: "Gabrielle Zevin",
    category: "Fiction",
    available: false
  },
  {
    id: 3,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    available: true
  },
  {
    id: 4,
    title: "The Pragmatic Programmer",
    author: "David Thomas and Andrew Hunt",
    category: "Technology",
    available: true
  },
  {
    id: 5,
    title: "The Lean Startup",
    author: "Eric Ries",
    category: "Business",
    available: false
  },
  {
    id: 6,
    title: "Good to Great",
    author: "Jim Collins",
    category: "Business",
    available: true
  },
  {
    id: 7,
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    available: true
  },
  {
    id: 8,
    title: "The Gene",
    author: "Siddhartha Mukherjee",
    category: "Science",
    available: false
  },
  {
    id: 9,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Development",
    available: true
  },
  {
    id: 10,
    title: "Deep Work",
    author: "Cal Newport",
    category: "Self Development",
    available: true
  },
  {
    id: 11,
    title: "Project Hail Mary",
    author: "Andy Weir",
    category: "Fiction",
    available: true
  },
  {
    id: 12,
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    category: "Technology",
    available: false
  }
];

const catalogueContainer = document.querySelector("#catalogue-container");
const searchInput = document.querySelector("#catalogue-search");
const categoryFilter = document.querySelector("#category-filter");
const favoritesStorageKey = "booknestFavorites";
const favoriteBookIds = new Set();

function loadFavoriteBookIds() {
  const savedFavorites = JSON.parse(localStorage.getItem(favoritesStorageKey)) || [];

  savedFavorites.forEach((bookId) => {
    favoriteBookIds.add(bookId);
  });
}

function saveFavoriteBookIds() {
  localStorage.setItem(favoritesStorageKey, JSON.stringify([...favoriteBookIds]));
}

function createBookCard(book) {
  const statusClass = book.available
    ? "book-card__status book-card__status--available"
    : "book-card__status book-card__status--borrowed";
  const statusText = book.available ? "Available" : "Borrowed";
  const isFavorite = favoriteBookIds.has(book.id);
  const favoriteClass = isFavorite
    ? "book-card__action book-card__action--favorite"
    : "book-card__action";
  const favoriteText = isFavorite ? "Favorited" : "Favorite";
  const favoriteLabel = isFavorite
    ? `Remove ${book.title} from favorites`
    : `Add ${book.title} to favorites`;

  return `
    <article class="book-card${isFavorite ? " book-card--favorite" : ""}" data-book-id="${book.id}">
      <div class="book-card__content">
        <p class="book-card__category">${book.category}</p>
        <h3 class="book-card__title">${book.title}</h3>
        <p class="book-card__author">by ${book.author}</p>
      </div>

      <div class="book-card__footer">
        <span class="${statusClass}">${statusText}</span>
        <button class="${favoriteClass}" type="button" data-favorite-id="${book.id}" aria-pressed="${isFavorite}" aria-label="${favoriteLabel}">
          ${favoriteText}
        </button>
      </div>
    </article>
  `;
}

function createEmptyState() {
  return `
    <div class="catalogue-empty" role="status">
      <h3>No books found.</h3>
      <p>Try changing your search or category.</p>
    </div>
  `;
}

function renderCatalogue(bookList) {
  if (bookList.length === 0) {
    catalogueContainer.innerHTML = createEmptyState();
    return;
  }

  catalogueContainer.innerHTML = bookList.map(createBookCard).join("");
}

function searchBooks(searchTerm) {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  if (!normalizedSearchTerm) {
    return books;
  }

  return books.filter((book) => {
    const title = book.title.toLowerCase();
    const author = book.author.toLowerCase();

    return title.includes(normalizedSearchTerm) || author.includes(normalizedSearchTerm);
  });
}

function filterBooksByCategory(bookList, category) {
  if (!category) {
    return bookList;
  }

  return bookList.filter((book) => book.category === category);
}

function applyCatalogueFilters() {
  const matchingSearchBooks = searchBooks(searchInput.value);
  const filteredBooks = filterBooksByCategory(matchingSearchBooks, categoryFilter.value);

  renderCatalogue(filteredBooks);
}

function toggleFavorite(bookId) {
  if (favoriteBookIds.has(bookId)) {
    favoriteBookIds.delete(bookId);
  } else {
    favoriteBookIds.add(bookId);
  }

  saveFavoriteBookIds();
  applyCatalogueFilters();
}

searchInput.addEventListener("input", applyCatalogueFilters);
categoryFilter.addEventListener("change", applyCatalogueFilters);
catalogueContainer.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite-id]");

  if (!favoriteButton) {
    return;
  }

  toggleFavorite(Number(favoriteButton.dataset.favoriteId));
});

loadFavoriteBookIds();
renderCatalogue(books);
