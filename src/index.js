// // Potrzebne odpowiedzi z backendu:
// // name.official - pełna nazwa kraju
// // capital - stolica
// // population - liczba ludności
// // flags.svg - link do ilustracji przedstawiającej flagę
// // languages - tablica języków



import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';
const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

const ref = {
  input: document.querySelector('#search-box'),
  ul: document.querySelector('.country-list'),
  div: document.querySelector('.country-info'),
};

const render = array => {
  if (array.length === 1) {
    ref.ul.innerHTML = '';
    const arrayLanguages = array.map(({ languages }) => Object.values(languages).join(', '));

    ref.div.innerHTML = array
      .map(({ flags, name, capital, population }) => {
        return `<h1><img class = "country-info-img" width='70' src="${flags.svg}" >${name.official}</h1>
        <ul>
        <li class = "country-info-item"><b>Capital:</b> ${capital}</li>
        <li class = "country-info-item"><b>Population:</b> ${population}</li>
        <li class = "country-info-item"><b>Languages:</b> ${arrayLanguages}</li>
        </ul>`;
      })
      .join('');
    
  }
  if (array.length > 1 && array.length <= 10) {
    ref.div.innerHTML = '';

    ref.ul.innerHTML = array
      .map(({ flags, name }) => {
        return `<li class = "country-item"><img class = "country-item-img"  width='70' src="${flags.svg}" >${name.common}</li>`;
      })
      .join('');
    
  }
  if (array.length > 10) {
    ref.ul.innerHTML = '';
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  }
};

const countryInformation = event => {
  const value = event.target.value.trim();
  if (!value) {
    ref.ul.innerHTML = '';
    ref.div.innerHTML = '';
    return;
  }
  fetchCountries(value)
    .then(array => render(array))
    .catch(error => {
      console.log(error);
      Notiflix.Notify.failure('Oops, there is no country with that name.');
    });
};

ref.input.addEventListener('input', debounce(countryInformation, DEBOUNCE_DELAY));