import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PicturesApiService from './js/picturesService';
import { refs } from './js/refs';

const simpleligthbox = new SimpleLightbox('.gallery a');
let totalHits = 0;
const picturesApiService = new PicturesApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
// refs.loadMoreBtn.disabled = true;
refs.loadMoreBtn.hidden = true;

function onSearch(e) {
  e.preventDefault();
  refs.loadMoreBtn.hidden = true;
  // const { searchQuery } = e.target.elements;
  // const searchText = searchQuery.value.trim();
  picturesApiService.query = e.target.elements.searchQuery.value.trim();

  totalHits = 0;

  clearGalleryContainer();
  if (!picturesApiService.query) {
    refs.loadMoreBtn.hidden = true;
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
      Notiflix.Notify.success(
        `Hooray! We found ${totalHits} of ${pictures.totalHits} images.`
      );
      // console.log(
      //   `Hooray! We found ${totalHits} of ${pictures.totalHits} images.`
      // );
      appendPicturesMarkup(pictures.hits);
      if (totalHits >= pictures.totalHits) {
        refs.loadMoreBtn.hidden = true;
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

// // var debounce = require(' lodash.debounce ');
// import debounce from 'lodash.debounce';
// import Notiflix from 'notiflix';
// import listTpl from './templates/country-list.hbs';
// import countryCardTpl from './templates/country-card.hbs';
// import './css/styles.css';
// import { fetchCountries } from './js/fetchCountries';

// const DEBOUNCE_DELAY = 300;
// // const DEBOUNCE_DELAY = 1000;
// const refs = {
//   searchBox: document.querySelector('#search-box'),
//   countryList: document.querySelector('.country-list'),
//   countryCard: document.querySelector('.country-info'),
// };

// refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

// function onSearch(e) {
//   const searchText = e.target.value.trim();

//   //   console.log(searchText);
//   //   console.log(searchText.length);

//   clearCountryList();
//   clearCountryCard();

//   if (!searchText.length) {
//     // clearCountryList();
//     // clearCountryCard();
//     return;
//   }
//   fetchCountries(searchText)
//     .then(countries => {
//       console.log(countries);

//       if (countries.length > 10) {
//         Notiflix.Notify.info(
//           'Too many matches found. Please enter a more specific name.'
//         );
//         console.log(
//           'Too many matches found. Please enter a more specific name.'
//         );
//         // clearCountryList();
//         // clearCountryCard();
//         return;
//       } else if (countries.length >= 2 && countries.length <= 10) {
//         appendCountryListMarkup(countries);
//         // clearCountryCard();
//         return;
//       }
//       //   clearCountryList();
//       appendCountryCardMarkup(countries);
//       //   refs.countryCard.insertAdjacentHTML(
//       //     'beforeend',
//       //     appendCountryCardMarkup(countries)
//       //   );
//       //   console.log('Big country');
//     })
//     .catch(error => {
//       Notiflix.Notify.failure('Oops, there is no country with that name');
//       console.log('Oops, there is no country with that name');
//     });
// }

// function appendCountryListMarkup(countries) {
//   refs.countryList.insertAdjacentHTML('beforeend', listTpl(countries));
//   //   refs.countryList.innerHTML = listTpl(countries);
// }

// function clearCountryList() {
//   refs.countryList.innerHTML = '';
// }

// function appendCountryCardMarkup(countries) {
//   refs.countryCard.insertAdjacentHTML(
//     'beforeend',
//     countryCardTpl({ countries })
//   );
//   //   refs.countryCard.innerHTML = countryCardTpl({ countries });
// }

// /**
//  *          const BASE_URL = 'https://restcountries.com/v3.1';
//  */
// // function appendCountryCardMarkup(countries) {
// //   return countries
// //     .map(({ name, flags, capital, population, languages }) => {
// //       return `<div class="country-wrapper">
// //               <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${
// //         name.official
// //       }" width = 30px height = 30px>
// //               <h2 class="country-list__name">${name.official}</h2>
// //       </div>
// // <p><b>Capital: </b>${capital}</p>
// //    <p><b>Population: </b>${population}</p>
// //    <p><b>Languages: </b>${Object.values(languages).join(', ')}</p>`;
// //     })
// //     .join('');
// // }

// function clearCountryCard() {
//   refs.countryCard.innerHTML = '';
// }
