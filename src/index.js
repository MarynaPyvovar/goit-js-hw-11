import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const API_KEY = '29177846-79ba9349bc407ca7d45dbb10e';
const BASE_URL = 'https://pixabay.com/api';
let page = 0;
let totalInfo = 0;

const onSubmitClick = async e => {
  e.preventDefault();
  refs.loadMoreBtn.style.display = 'none';
  refs.gallery.innerHTML = '';
  page = 1;
  totalInfo = 40;

  const data = await fetchItems(refs.input.value);
  if (data) {
    await renderGallery(data);
    Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
    // await lightbox.refresh();
    const lightbox = new SimpleLightbox('.gallery a');
  }
};

const fetchItems = async query => {
  const searchQuery = query.trim();
  try {
    if (searchQuery) {
      const responce = await axios.get(
        `${BASE_URL}/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
      );
      if (responce.data.total === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      refs.loadMoreBtn.style.display = 'block';
      return responce.data;
    } else {
      Notiflix.Notify.failure('Enter your search query.');
    }
  } catch (error) {
    console.log(error);
  }
};

const renderGallery = async data => {
  try {
    const gallery = data?.hits
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) =>
          `<a href="${largeImageURL}">
      <div class="photo-card">
  <img src="${webformatURL}" width="300" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>${likes} Likes</b>
    </p>
    <p class="info-item">
      <b>${views} Views</b>
    </p>
    <p class="info-item">
      <b>${comments} Comments</b>
    </p>
    <p class="info-item">
      <b>${downloads} Downloads</b>
    </p>
  </div>
</div>
</a>`
      )
      .join('');
    refs.gallery.insertAdjacentHTML('beforeend', gallery);
  } catch (error) {
    console.log(error);
  }
};

const onLoadMoreClick = async () => {
  page += 1;
  const data = await fetchItems(refs.input.value);
  await renderGallery(data);
  totalInfo += 40;
  console.log(totalInfo);
  if (data.totalHits >= totalInfo) {
    refs.loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
};

refs.form.addEventListener('submit', onSubmitClick);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);
