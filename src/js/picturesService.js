// const axios = require('axios');
import axios from 'axios';
import Notiflix from 'notiflix';
import { refs } from './refs';

export default class PicturesApiService {
  constructor() {
    this.searchText = '';
    this.page = 1;
  }

  async getPictures() {
    console.log('До запиту: ', this);
    const instance = axios.create({
      baseURL: 'https://pixabay.com/api/',
      params: {
        key: '31583377-fa4c6976355a1f179c9a11dc6',
        q: `${this.searchText}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: `${this.page}`,
        per_page: '200',
      },
    });

    const response = await instance.get();
    console.log(response);

    // if (response.status !== 200) {
    //   throw new Error(response.statusText);
    // }
    if (!response.data.hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      // alert('Not Found');
      // console.log('Not Found');
      refs.loadMoreBtn.hidden = true;
      return;
    }
    this.page += 1;
    console.log('Після запиту: ', this);
    return await response.data;
  }

  get query() {
    return this.searchText;
  }

  set query(newQuery) {
    this.searchText = newQuery;
  }

  resetPage() {
    this.page = 1;
  }
}

// async function getPictures(name, page = 1) {
// const instance = axios.create({
//   baseURL: 'https://pixabay.com/api/',
//   params: {
//     key: '31583377-fa4c6976355a1f179c9a11dc6',
//     q: `${name}`,
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: true,
//     page: `${page}`,
//     per_page: '5',
//   },
// });
//   // const API_KEY = '31583377-fa4c6976355a1f179c9a11dc6';
//   // const parameters = `q=${name}&image_type=photo&orientation=horizontal&safesearch=true`;

//   const response = await instance.get();
//   // if (response.status !== 200) {
//   //   throw new Error(response.statusText);
//   // }
//   return response.data;

//   // const BASE_URL = 'https://pixabay.com/api';
//   // const API_KEY = '31583377-fa4c6976355a1f179c9a11dc6';
//   // const parameters = `q=${name}&image_type =photo&orientation =horizontal&safesearch =true`;

//   // const response = await axios.get(`${BASE_URL}?key=${API_KEY}&${parameters}`);
//   // if (!response.ok) {
//   //   throw new Error(response.statusText);
//   // }
//   // const data = await response.json;
//   // return data;
// }

// export { getPictures };

// function fetchPictures(name) {
//   const BASE_URL = 'https://pixabay.com/api';
//   const API_KEY = '31583377-fa4c6976355a1f179c9a11dc6';
//   const parameters = `q=${name}&image_type =photo&orientation =horizontal&safesearch =true`;

//   return fetch(`${BASE_URL}?key=${API_KEY}&${parameters}`)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(response.status);
//       }
//       return response.json();
//     })
//     .then(data => {
//       return data;
//     });
// }

// export { fetchPictures };
