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

refs.form.addEventListener('submit', onSubmitClick);
// refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);

refs.loadMoreBtn.style.display = 'none';
refs.gallery.style.display = 'flex';
refs.gallery.style.flexWrap = 'wrap';
refs.gallery.style.justifyContent = 'space-around';

function onSubmitClick(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';

  renderGallery();

  refs.loadMoreBtn.style.display = 'block';
}

const fetchItems = async searchQuery => {
  try {
    if (searchQuery) {
      const responce = await axios.get(
        `${BASE_URL}/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true$per_page=40`
      );
      if (responce.data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      return responce.data;
    }
  } catch (error) {
    console.log(error);
  }
};

const renderGallery = async () => {
  try {
    const data = await fetchItems(refs.input.value);
    console.log(data.hits);
    const gallery = await data.hits
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

    const lightbox = new SimpleLightbox('.gallery a');
  } catch (error) {
    console.log(error);
  }
};

// const onLoadMoreClick = async () => {}
