import PicturesApiService from './js/picturesService';

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
let totalHits = 0;

const picturesApiService = new PicturesApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
// refs.loadMoreBtn.disabled = true;
refs.loadMoreBtn.hidden = true;

function onSearch(e) {
  e.preventDefault();
  // const { searchQuery } = e.target.elements;
  // const searchText = searchQuery.value.trim();
  picturesApiService.query = e.target.elements.searchQuery.value.trim();

  totalHits = 0;

  clearGalleryContainer();
  if (!picturesApiService.query) {
    return alert('Заповніть будь ласка поле вводу');
  }
  picturesApiService.resetPage();
  picturesApiService
    .getPictures()
    .then(pictures => {
      console.log(pictures.hits);
      totalHits += pictures.hits.length;
      console.log(
        `Hooray! We found ${totalHits} of ${pictures.totalHits} images.`
      );
      appendPicturesMarkup(pictures.hits);
      // refs.loadMoreBtn.disabled = false;
      refs.loadMoreBtn.hidden = false;
    })
    .catch(error => {
      console.log(error);
    });
}

function onLoadMore() {
  // if (!picturesApiService.query) {
  //   return;
  // }
  picturesApiService
    .getPictures()
    .then(pictures => {
      console.log(pictures.hits);
      totalHits += pictures.hits.length;
      console.log(
        `Hooray! We found ${totalHits} of ${pictures.totalHits} images.`
      );
      appendPicturesMarkup(pictures.hits);
      if (totalHits >= pictures.totalHits) {
        refs.loadMoreBtn.hidden = true;
        alert(`"We're sorry, but you've reached the end of search results.`);
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
      <a class="gallery__item"  href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
      </a>
      <div class="info">
        <p class="info-item"><b>Likes: </b>${likes}</p>
        <p class="info-item"><b>Views: </b>${views}</p>
        <p class="info-item"><b>Comments: </b>${comments}</p>
        <p class="info-item"><b>Downloads: </b>${downloads}</p>
      </div>
    </div>`
    )
    .join('');
}

function appendPicturesMarkup(pictures) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', createMarkup(pictures));
}

function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}
