import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const gallerySection = document.querySelector('.gallery-section');
const loadMoreBtn = document.querySelector('.load-more-btn');
const loader = document.querySelector('.loader');

const API_KEY = '49441477-341b75558156795e6f3713ba3';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 12;

const iziToastSettings = {
  position: 'topRight',
  timeout: 3000,
  progressBarColor: 'rgb(0, 255, 184)',
  transitionIn: 'fadeInLeft',
  transitionOut: 'fadeOutRight',
};

let fetchedData = [];

// Global variables for pagination and query
let currentPage = 1;
let currentQuery = '';
let totalHits = 0;
let isLoadingMore = false; // Flag to prevent multiple load more requests
let autoLoadCount = 0; // Counter for automatic loads via scroll
const AUTO_LOAD_LIMIT = 2; // Number of times to auto-load before showing button

// Hide load more button initially. It will be shown after AUTO_LOAD_LIMIT scrolls.
loadMoreBtn.style.display = 'none';
// Hide loader initially
loader.style.display = 'none';

const fetchImages = async (query, page = 1) => {
  loader.style.display = 'flex'; // Show loader when fetching starts
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: PER_PAGE,
      },
    });
    totalHits = response.data.totalHits;
    return response.data.hits;
  } catch (error) {
    iziToast.show({
      ...iziToastSettings,
      title: 'Error',
      message: `🟥 We cannot reach the server. Please try again later. Error: ${error.message} 🟥`,
      color: 'red',
    });
    return [];
  } finally {
    loader.style.display = 'none'; // Ensure loader is hidden even if there's an error
  }
};

const handleSearch = async event => {
  event.preventDefault();
  const queryInput = searchForm.querySelector('input[data-search-input]');
  const query = queryInput.value.trim();

  if (!query) {
    iziToast.show({
      ...iziToastSettings,
      title: 'Info',
      message: 'Please enter a search term.',
      color: 'blue',
    });
    return;
  }

  gallerySection.innerHTML = '';
  currentPage = 1;
  currentQuery = query;
  totalHits = 0; // Reset total hits on new search
  isLoadingMore = false; // Reset loading flag
  autoLoadCount = 0; // Reset auto load counter
  loadMoreBtn.style.display = 'none'; // Ensure button is hidden on new search
  window.addEventListener('scroll', scrollHandler); // Re-enable scroll listener if disabled

  try {
    const images = await fetchImages(currentQuery, currentPage);
    if (images.length === 0) {
      iziToast.show({
        ...iziToastSettings,
        title: 'No Results',
        message: `Sorry, there are no images matching your search query "${query}". Please try again!`,
        color: 'yellow',
      });
      return;
    }

    fetchedData = images;
    renderGallery(images);
    // Initial check - might show button immediately if less than 5 pages total
    checkEndOfResults();
  } catch (error) {
    console.error('Search handling error:', error);
    iziToast.show({
      ...iziToastSettings,
      title: 'Error',
      message: 'An unexpected error occurred during the search.',
      color: 'red',
    });
  } finally {
    queryInput.value = '';
  }
};
searchForm.addEventListener('submit', handleSearch);

const handleLoadMore = async (isScrollTriggered = false) => {
  if (isLoadingMore) return; // Prevent multiple simultaneous loads

  const totalPages = Math.ceil(totalHits / PER_PAGE);
  if (currentPage >= totalPages) {
    loadMoreBtn.style.display = 'none';
    iziToast.show({
      ...iziToastSettings,
      title: 'Info',
      message: "We're sorry, but you've reached the end of search results.",
      color: 'blue',
    });
    return;
  }

  if (isScrollTriggered && autoLoadCount >= AUTO_LOAD_LIMIT) {
    return;
  }

  isLoadingMore = true;
  loadMoreBtn.disabled = true;
  if (isScrollTriggered) {
    autoLoadCount++;
  }
  currentPage++;
  loader.style.display = 'flex';

  try {
    const images = await fetchImages(currentQuery, currentPage);
    renderGallery(images);

    // Smooth scroll to the new images
    const { height: cardHeight } = document
      .querySelector('.gallery-item')
      .getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    checkEndOfResults();
  } catch (error) {
    console.error('Load more error:', error);
    iziToast.show({
      ...iziToastSettings,
      title: 'Error',
      message: 'Failed to load more images.',
      color: 'red',
    });
  } finally {
    isLoadingMore = false;
    loader.style.display = 'none';
    loadMoreBtn.disabled = false;
  }
};

// Re-add button event listener
loadMoreBtn.addEventListener('click', () => handleLoadMore(false)); // Pass false for isScrollTriggered

let lightbox = new SimpleLightbox('.gallery-section a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const createGalleryItem = image => {
  const galleryItem = document.createElement('div');
  galleryItem.classList.add('gallery-item');
  galleryItem.innerHTML = `
    <a href="${image.largeImageURL}">
      <img width="${image.webformatWidth}" height="${image.webformatHeight}" src="${image.webformatURL}" alt="${image.tags}" />
    </a>
    <div class="info">
      <div class="info-box">
        <b>Likes</b>
        ${image.likes}
      </div>
      <div class="info-box">
        <b>Views</b>
        ${image.views}
      </div>
      <div class="info-box">
        <b>Comments</b>
        ${image.comments}
      </div>
      <div class="info-box">
        <b>Downloads</b>
        ${image.downloads}
      </div>
    </div>
  `;
  return galleryItem;
};

const renderGallery = images => {
  const fragment = document.createDocumentFragment();
  images.forEach(image => {
    const galleryItem = createGalleryItem(image);
    fragment.appendChild(galleryItem);
  });
  gallerySection.appendChild(fragment);
  lightbox.refresh();
};

const checkEndOfResults = () => {
  const totalPages = Math.ceil(totalHits / PER_PAGE);
  const isEndOfResults = currentPage >= totalPages;

  if (isEndOfResults) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'block';
  }
};

// Infinite Scroll Logic (modified)
const scrollHandler = () => {
  // Check if already loading, if there's a query, if there are hits, and if auto load limit not reached
  if (
    isLoadingMore ||
    !currentQuery ||
    totalHits === 0 ||
    autoLoadCount >= AUTO_LOAD_LIMIT
  )
    return;

  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const totalPages = Math.ceil(totalHits / PER_PAGE);

  // Check if near bottom and if there are more pages to load
  if (
    scrollTop + clientHeight >= scrollHeight - 150 &&
    currentPage < totalPages
  ) {
    // Increased threshold slightly
    handleLoadMore(true); // Pass true for isScrollTriggered
  }
};

// Attach initial scroll listener
window.addEventListener('scroll', scrollHandler);
