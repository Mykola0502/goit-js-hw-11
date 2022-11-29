import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PicturesApiService from './js/picturesService';
import { refs } from './js/refs';

/**
 *         Infiniti Scroll
 *
 */
const simpleligthbox = new SimpleLightbox('.gallery a');
const options = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0,
};
const observer = new IntersectionObserver(onLoadMore, options);
let totalHits = 0;
const picturesApiService = new PicturesApiService();

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

  picturesApiService.query = e.target.elements.searchQuery.value.trim();
  totalHits = 0;

  clearGalleryContainer();
  observer.unobserve(refs.guard);

  if (!picturesApiService.query) {
    // refs.loadMoreBtn.hidden = true;
    return Notiflix.Notify.info('Заповніть будь ласка поле вводу');
    // return alert('Заповніть будь ласка поле вводу');
  }

  picturesApiService.resetPage();
  picturesApiService
    .getPictures()
    .then(pictures => {
      console.log(pictures.hits);
      totalHits += pictures.hits.length;
      Notiflix.Notify.success(
        `Hooray! We found ${totalHits} of ${pictures.totalHits} images.`
      );
      // console.log(
      //   `Hooray! We found ${totalHits} of ${pictures.totalHits} images.`
      // );
      appendPicturesMarkup(pictures.hits);
      // refs.loadMoreBtn.disabled = false;
      // refs.loadMoreBtn.hidden = false;
    })
    .catch(error => {
      console.log(error);
    });
}

function onLoadMore(entries, observer) {
  if (!picturesApiService.query) {
    return;
  }

  entries.forEach(entry => {
    if (entry.isIntersecting) {
      picturesApiService
        .getPictures()
        .then(pictures => {
          console.log(pictures.hits);
          totalHits += pictures.hits.length;
          Notiflix.Notify.success(
            `Hooray! We found ${totalHits} of ${pictures.totalHits} images.`
          );
          // console.log(
          //   `Hooray! We found ${totalHits} of ${pictures.totalHits} images.`
          // );
          appendPicturesMarkup(pictures.hits);
          if (totalHits >= pictures.totalHits) {
            observer.unobserve(refs.guard);
            // refs.loadMoreBtn.hidden = true;
            Notiflix.Notify.info(
              `We're sorry, but you've reached the end of search results.`
            );
            // alert(`We're sorry, but you've reached the end of search results.`);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
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

  observer.observe(refs.guard);
  simpleligthbox.refresh();

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}

/**
 *     onLoadMoreBTN
 *
 */
// const simpleligthbox = new SimpleLightbox('.gallery a');
// let totalHits = 0;
// const picturesApiService = new PicturesApiService();

// refs.searchForm.addEventListener('submit', onSearch);
// refs.loadMoreBtn.addEventListener('click', onLoadMore);
// // refs.loadMoreBtn.disabled = true;
// refs.loadMoreBtn.hidden = true;

// function onSearch(e) {
//   e.preventDefault();
//   refs.loadMoreBtn.hidden = true;
//   // const { searchQuery } = e.target.elements;
//   // const searchText = searchQuery.value.trim();
//   picturesApiService.query = e.target.elements.searchQuery.value.trim();

//   totalHits = 0;

//   clearGalleryContainer();
//   if (!picturesApiService.query) {
//     refs.loadMoreBtn.hidden = true;
//     return Notiflix.Notify.info('Заповніть будь ласка поле вводу');
//     // return alert('Заповніть будь ласка поле вводу');
//   }
//   picturesApiService.resetPage();
//   picturesApiService
//     .getPictures()
//     .then(pictures => {
//       console.log(pictures.hits);
//       totalHits += pictures.hits.length;
//       Notiflix.Notify.success(
//         `Hooray! We found ${totalHits} of ${pictures.totalHits} images.`
//       );
//       // console.log(
//       //   `Hooray! We found ${totalHits} of ${pictures.totalHits} images.`
//       // );
//       appendPicturesMarkup(pictures.hits);
//       // refs.loadMoreBtn.disabled = false;
//       refs.loadMoreBtn.hidden = false;
//     })
//     .catch(error => {
//       console.log(error);
//     });
// }

// function onLoadMore() {
//   // if (!picturesApiService.query) {
//   //   return;
//   // }
//   picturesApiService
//     .getPictures()
//     .then(pictures => {
//       console.log(pictures.hits);
//       totalHits += pictures.hits.length;
//       Notiflix.Notify.success(
//         `Hooray! We found ${totalHits} of ${pictures.totalHits} images.`
//       );
//       // console.log(
//       //   `Hooray! We found ${totalHits} of ${pictures.totalHits} images.`
//       // );
//       appendPicturesMarkup(pictures.hits);
//       if (totalHits >= pictures.totalHits) {
//         refs.loadMoreBtn.hidden = true;
//         Notiflix.Notify.info(
//           `We're sorry, but you've reached the end of search results.`
//         );
//         // alert(`We're sorry, but you've reached the end of search results.`);
//       }
//     })
//     .catch(error => {
//       console.log(error);
//     });
// }

// function createMarkup(arr) {
//   return arr
//     .map(
//       ({
//         webformatURL,
//         largeImageURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       }) => `<div class="photo-card">
//       <a class="gallery__item"  href="${largeImageURL}">
//       <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
//       </a>
//       <div class="info">
//         <p class="info-item"><b>Likes: </b>${likes}</p>
//         <p class="info-item"><b>Views: </b>${views}</p>
//         <p class="info-item"><b>Comments: </b>${comments}</p>
//         <p class="info-item"><b>Downloads: </b>${downloads}</p>
//       </div>
//     </div>`
//     )
//     .join('');
// }

// function appendPicturesMarkup(pictures) {
//   refs.galleryContainer.insertAdjacentHTML('beforeend', createMarkup(pictures));

//   simpleligthbox.refresh();

//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }

// function clearGalleryContainer() {
//   refs.galleryContainer.innerHTML = '';
// }
