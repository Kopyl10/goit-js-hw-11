import { fetchImages } from './js/pixabay-api.js';

import Notiflix from 'notiflix';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let searchQuery = '';

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

function renderGallery(images) {
  const markup = images
    .map(
      image => `
    <div class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
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
}
