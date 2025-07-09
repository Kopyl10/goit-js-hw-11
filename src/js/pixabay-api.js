import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '51235432-547741da21716631263047801';
export async function fetchImages(query, page = 1, perPage = 40) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: perPage,
    },
  });

  return response.data;
}
