import {FILTER_DATA, CARD_DATA} from './data';
import {clearSection, getRandomNumber} from "./utils";
import {createFilter} from "./create-filter";
import {createCard} from "./create-card";

const FILTER_BLOCK = document.querySelector(`.main__filter`);
const CARD_LIST = document.querySelector(`.board__tasks`);

/**
 * Заполняет ноду фильтрами
 * @param {Array} data - массив фильтров
 * @param {string} section - DOM нода
 */
const fillCardWithFilters = (data, section) => {
  data.forEach((item) => section.insertAdjacentHTML(`beforeend`, createFilter(item.name, item.amount, item.isChecked)));
};

/**
 * Отрисовывает заданное количество карточек
 * @param {number} num - число карточек которое нужно отрисовать
 * @param {Array} data - массив с данными
 */
const createSpecifiedNumCard = (num) => {
  for (let i = 0; i < num; i++) {
    CARD_LIST.insertAdjacentHTML(`beforeend`, createCard(CARD_DATA));
  }
};

FILTER_BLOCK.addEventListener(`change`, (e) => {
  if (e.target.tagName.toLowerCase() === `input`) {
    clearSection(CARD_LIST);
    createSpecifiedNumCard(getRandomNumber(CARD_DATA.MIN, CARD_DATA.MAX));
  }
});

clearSection(CARD_LIST);
clearSection(FILTER_BLOCK);
fillCardWithFilters(FILTER_DATA, FILTER_BLOCK);
createSpecifiedNumCard(CARD_DATA.MAX);
