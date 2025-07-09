import { fetchImages } from './js/pixabay-api.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let searchQuery = '';

let lightbox = new SimpleLightbox('.gallery a');

form.addEventListener('submit', async e => {
  e.preventDefault();
  searchQuery = e.target.searchQuery.value.trim();
  if (!searchQuery) return;

  currentPage = 1;
  gallery.innerHTML = '';
  loadMoreBtn.hidden = true;

  try {
    const data = await fetchImages(searchQuery, currentPage);
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    renderGallery(data.hits);

    if (data.totalHits > 40) {
      loadMoreBtn.hidden = false;
    }
  } catch (error) {
    Notiflix.Notify.failure('Something went wrong. Try again later.');
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;

  try {
    const data = await fetchImages(searchQuery, currentPage);
    renderGallery(data.hits);
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    const totalPages = Math.ceil(data.totalHits / 40);
    if (currentPage >= totalPages) {
      loadMoreBtn.hidden = true;
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    Notiflix.Notify.failure('Something went wrong while loading more images.');
  }
});

function renderGallery(images) {
  const markup = images
    .map(
      image => `
      <div class="photo-card">
        <a class="gallery__link" href="${image.largeImageURL}">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes</b> ${image.likes}</p>
          <p class="info-item"><b>Views</b> ${image.views}</p>
          <p class="info-item"><b>Comments</b> ${image.comments}</p>
          <p class="info-item"><b>Downloads</b> ${image.downloads}</p>
        </div>
      </div>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh(); // 🔄 update lightbox with new images
}
